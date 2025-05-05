// Update the initialization function to set up the purpose fields
// In the initializeApp function, add:
function initializeApp() {
    // Existing initialization code...
    initializeLanguageSync();
    syncPurposeValues(); // Add this line
    setActiveTab('parties');
    generateDocument();
    
    // Existing code...
    document.getElementById('conf-info').dispatchEvent(new Event('change'));
    
    // Set up the custom purpose toggle
    toggleCustomPurpose(); // Add this line
}

// Add event listeners for the purpose dropdowns
document.addEventListener('DOMContentLoaded', function() {
    // Existing DOMContentLoaded code...
    
    // Add these lines:
    document.getElementById('purpose').addEventListener('change', toggleCustomPurpose);
    document.getElementById('purpose-ru').addEventListener('change', toggleCustomPurpose);
});
