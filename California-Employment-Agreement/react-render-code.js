// React 18 rendering code
document.addEventListener('DOMContentLoaded', function() {
  try {
    // Try modern React 18 createRoot method first
    if (ReactDOM.createRoot) {
      console.log("Using React 18 createRoot API");
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(React.createElement(App));
    } else {
      // Fall back to legacy render method if needed
      console.log("Using legacy ReactDOM.render API");
      ReactDOM.render(React.createElement(App), document.getElementById('root'));
    }
    
    // Initialize Feather icons after render
    if (window.feather) {
      window.feather.replace();
    }
    
    console.log("React rendering complete");
  } catch (error) {
    console.error("Error rendering React application:", error);
    
    // Display error to user
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="padding: 2rem; text-align: center; color: #b91c1c;">
          <h2>Application Error</h2>
          <p>Sorry, there was a problem loading the application. Please try refreshing the page.</p>
          <p><small>Error details: ${error.message}</small></p>
        </div>
      `;
    }
  }
});