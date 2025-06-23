// eSignatures.com Success Page Override Script
// This script detects when user is on eSignatures.com success page and overlays our interface

(function() {
    'use strict';
    
    // Check if we're on an eSignatures.com success page
    function isESignSuccessPage() {
        return window.location.hostname === 'esignatures.com' && 
               (window.location.pathname.includes('/sign/') && 
                window.location.pathname.includes('/signed'));
    }
    
    // Extract contract ID from URL
    function getContractIdFromUrl() {
        const match = window.location.pathname.match(/\/sign\/([^\/]+)\/signed/);
        return match ? match[1] : null;
    }
    
    // Create overlay with our success interface
    function createSuccessOverlay(contractId) {
        // Create overlay container
        const overlay = document.createElement('div');
        overlay.id = 'terms-law-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 999999;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: Arial, sans-serif;
        `;
        
        // Create content container
        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            padding: 40px;
            border-radius: 12px;
            max-width: 600px;
            width: 90%;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            position: relative;
        `;
        
        // Get form data from localStorage if available
        let formData = {};
        try {
            const stored = localStorage.getItem('demandLetterFormData');
            if (stored) {
                formData = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Error reading form data:', error);
        }
        
        content.innerHTML = `
            <div style="font-size: 48px; color: #28a745; margin-bottom: 20px;">✅</div>
            <h1 style="color: #28a745; margin-bottom: 20px;">Document Signed Successfully!</h1>
            <p style="font-size: 16px; color: #666; margin-bottom: 30px; line-height: 1.5;">
                Your demand letter has been signed and is ready for submission to Stripe.
            </p>
            
            <div style="margin-bottom: 30px;">
                <button id="sendToStripeBtn" style="
                    background: #28a745;
                    color: white;
                    padding: 15px 30px;
                    border: none;
                    border-radius: 6px;
                    font-size: 16px;
                    cursor: pointer;
                    margin: 10px;
                    font-weight: bold;
                ">📧 Send to Stripe Now</button>
                
                <button id="viewPdfBtn" style="
                    background: #007cba;
                    color: white;
                    padding: 15px 30px;
                    border: none;
                    border-radius: 6px;
                    font-size: 16px;
                    cursor: pointer;
                    margin: 10px;
                ">📄 View Signed PDF</button>
                
                <button id="closeOverlayBtn" style="
                    background: #6c757d;
                    color: white;
                    padding: 15px 30px;
                    border: none;
                    border-radius: 6px;
                    font-size: 16px;
                    cursor: pointer;
                    margin: 10px;
                ">❌ Close</button>
            </div>
            
            <div id="status" style="
                margin-top: 20px;
                padding: 15px;
                border-radius: 4px;
                display: none;
            "></div>
            
            <div id="pdfViewer" style="
                margin-top: 30px;
                display: none;
            ">
                <h3>Signed Document:</h3>
                <iframe id="pdfFrame" src="" style="
                    width: 100%;
                    height: 500px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                "></iframe>
            </div>
        `;
        
        overlay.appendChild(content);
        document.body.appendChild(overlay);
        
        // Add event listeners
        let contractData = null;
        
        // Check contract status
        async function checkContractStatus() {
            try {
                showStatus('Checking document status...', 'loading');
                
                const response = await fetch(`http://localhost:3001/contract-status/${contractId}`);
                const data = await response.json();
                
                if (data.success && data.signed) {
                    contractData = data;
                    showStatus('✅ Document verified as signed and ready!', 'success');
                    document.getElementById('sendToStripeBtn').disabled = false;
                    document.getElementById('viewPdfBtn').disabled = false;
                } else {
                    showStatus('Document is not fully signed yet. Please wait a moment.', 'error');
                }
            } catch (error) {
                console.error('Error checking status:', error);
                showStatus('Error checking document status. Please try again.', 'error');
            }
        }
        
        // Send to Stripe function
        async function sendToStripe() {
            if (!contractData || !contractData.pdf_url) {
                showStatus('Error: No signed document available to send.', 'error');
                return;
            }
            
            const button = document.getElementById('sendToStripeBtn');
            button.disabled = true;
            button.textContent = '📧 Sending...';
            
            try {
                showStatus('Sending signed document to Stripe...', 'loading');
                
                const emailData = {
                    contractId: contractId,
                    pdfUrl: contractData.pdf_url,
                    companyName: formData.companyName || 'Company',
                    contactName: formData.contactName || 'Contact',
                    withheldAmount: formData.withheldAmount || '0'
                };
                
                const response = await fetch('http://localhost:3001/send-to-stripe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(emailData)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showStatus(\`✅ Success! Signed demand letter sent to Stripe. Message ID: \${result.messageId}\`, 'success');
                    button.textContent = '✅ Sent to Stripe!';
                } else {
                    throw new Error(result.error || 'Failed to send email');
                }
                
            } catch (error) {
                console.error('Error sending to Stripe:', error);
                showStatus(\`❌ Error: \${error.message}\`, 'error');
                button.disabled = false;
                button.textContent = '📧 Send to Stripe Now';
            }
        }
        
        // View PDF function
        function viewPdf() {
            if (!contractData || !contractData.pdf_url) {
                showStatus('Error: No PDF available to view.', 'error');
                return;
            }
            
            const pdfViewer = document.getElementById('pdfViewer');
            const pdfFrame = document.getElementById('pdfFrame');
            
            pdfFrame.src = contractData.pdf_url;
            pdfViewer.style.display = 'block';
        }
        
        // Show status function
        function showStatus(message, type) {
            const status = document.getElementById('status');
            status.textContent = message;
            status.style.display = 'block';
            
            // Set colors based on type
            if (type === 'success') {
                status.style.background = '#d4edda';
                status.style.color = '#155724';
                status.style.border = '1px solid #c3e6cb';
            } else if (type === 'error') {
                status.style.background = '#f8d7da';
                status.style.color = '#721c24';
                status.style.border = '1px solid #f5c6cb';
            } else if (type === 'loading') {
                status.style.background = '#d1ecf1';
                status.style.color = '#0c5460';
                status.style.border = '1px solid #b8daff';
            }
        }
        
        // Add event listeners
        document.getElementById('sendToStripeBtn').addEventListener('click', sendToStripe);
        document.getElementById('viewPdfBtn').addEventListener('click', viewPdf);
        document.getElementById('closeOverlayBtn').addEventListener('click', () => {
            overlay.remove();
        });
        
        // Initial status check
        checkContractStatus();
    }
    
    // Auto-redirect after a delay to allow eSignatures.com to finish loading
    function setupAutoRedirect(contractId) {
        setTimeout(() => {
            if (isESignSuccessPage()) {
                console.log('Creating overlay for contract:', contractId);
                createSuccessOverlay(contractId);
            }
        }, 2000); // Wait 2 seconds for page to fully load
    }
    
    // Main execution
    if (isESignSuccessPage()) {
        const contractId = getContractIdFromUrl();
        if (contractId) {
            console.log('Detected eSignatures.com success page for contract:', contractId);
            setupAutoRedirect(contractId);
        }
    }
    
})();