// Updated ReactDOM rendering code for California Employment Agreement Generator

// Mount the React app
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);

// This ensures all Feather icons are initialized
document.addEventListener('DOMContentLoaded', function() {
  feather.replace();
  
  // Re-initialize feather icons after React renders
  setTimeout(() => {
    feather.replace();
  }, 100);
});
