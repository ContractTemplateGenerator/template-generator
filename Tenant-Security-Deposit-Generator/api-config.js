// API Configuration for eSignature integration
// Update this file with your actual Vercel deployment URL

window.API_CONFIG = {
    // Default Vercel deployment URL (update after deployment)
    BASE_URL: 'https://template-generator-api.vercel.app',
    
    // API endpoints
    ENDPOINTS: {
        ESIGN: '/api/mcp-esign',
        TEST: '/api/test'
    },
    
    // Helper function to get full API URL
    getApiUrl: function(endpoint) {
        return this.BASE_URL + (this.ENDPOINTS[endpoint] || endpoint);
    }
};