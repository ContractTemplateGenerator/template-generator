// Fix for App component and React rendering
window.addEventListener('DOMContentLoaded', function() {
  // After all scripts are loaded, attempt to find and fix the React rendering
  setTimeout(function() {
    try {
      console.log("Applying React rendering fix");
      
      // Check if the App component is available but not rendered
      if (typeof App !== 'undefined' && document.getElementById('root')) {
        console.log("App component found, attempting to render");
        
        // Try to render using modern React 18 method
        if (ReactDOM.createRoot) {
          console.log("Using React 18 createRoot");
          const root = ReactDOM.createRoot(document.getElementById('root'));
          root.render(React.createElement(App));
        } else {
          // Fall back to legacy render
          console.log("Using legacy ReactDOM.render");
          ReactDOM.render(
            React.createElement(App),
            document.getElementById('root')
          );
        }
        
        // Replace Feather icons
        if (window.feather) {
          setTimeout(function() {
            window.feather.replace();
          }, 500);
        }
      } else {
        console.error("App component not found or root element missing");
      }
    } catch (error) {
      console.error("Error in React rendering fix:", error);
    }
  }, 2000); // Wait 2 seconds for scripts to load
});