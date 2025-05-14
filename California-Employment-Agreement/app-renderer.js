// This script ensures the App component is rendered correctly
// It's added as a separate file to avoid modifying the main application code

// Wait for the document to fully load
document.addEventListener('DOMContentLoaded', function() {
  // Attempt to render after a short delay to ensure all scripts are loaded
  setTimeout(function() {
    try {
      console.log("Attempting to render App component");
      
      // Check if App component exists
      if (typeof App === 'undefined') {
        console.error("App component not found - check california-employment-agreement.js");
        return;
      }
      
      // Check if root element exists
      const rootElement = document.getElementById('root');
      if (!rootElement) {
        console.error("Root element not found");
        return;
      }
      
      // Attempt to render
      console.log("Rendering App component");
      ReactDOM.render(React.createElement(App), rootElement);
      
      // Initialize Feather icons after render
      setTimeout(function() {
        if (window.feather) {
          window.feather.replace();
          console.log("Feather icons initialized");
        }
      }, 500);
      
      console.log("App component rendered successfully");
    } catch (error) {
      console.error("Error rendering App component:", error);
    }
  }, 1000);
});
