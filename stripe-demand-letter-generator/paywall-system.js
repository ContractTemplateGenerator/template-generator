// PayPal Paywall System for Stripe Demand Letter Generator
// Integrates with existing generator to require payment before copy/download access

const PaywallSystem = (() => {
    // PayPal Configuration - Updated pricing and credentials
    const PAYPAL_CONFIG = {
        clientId: 'ASmwKug6zVE_78S-152YKAzzh2iH8VgSjs-P6RkrWcfqdznNjeE_UYwKJkuJ3BvIJrxCotS8GtXEJ2fx',
        secretKey: 'EKqfxP31dZw2wFl1xNiVIPZm9LmgrL9OyyinQdESLAHInrhXU0Lkte2Sh0b3zgxxdlIJNBt0SkCgTVjI',
        currency: 'USD',
        amount: '29.95', // Updated price for the demand letter generator
        description: 'Stripe Demand Letter Generator - Professional Legal Document'
    };

    // Persistent payment status tracking using localStorage
    const getPaymentStatus = () => {
        try {
            const stored = localStorage.getItem('stripeGeneratorPaymentStatus');
            if (stored) {
                const parsed = JSON.parse(stored);
                // Check if payment is within 30 days
                if (parsed.paymentDate) {
                    const paymentDate = new Date(parsed.paymentDate);
                    const now = new Date();
                    const daysSincePayment = (now - paymentDate) / (1000 * 60 * 60 * 24);
                    if (daysSincePayment < 30) {
                        return { ...parsed, sessionActive: true };
                    }
                }
            }
        } catch (e) {
            console.error('Error reading payment status:', e);
        }
        return {
            isPaid: false,
            transactionId: null,
            paymentDate: null,
            sessionActive: false
        };
    };

    const savePaymentStatus = (status) => {
        try {
            localStorage.setItem('stripeGeneratorPaymentStatus', JSON.stringify(status));
        } catch (e) {
            console.error('Error saving payment status:', e);
        }
    };

    let paymentStatus = getPaymentStatus();

    // In-memory form data backup to preserve user's work during payment
    let formDataBackup = null;

    // Initialize PayPal SDK
    const initializePayPal = () => {
        if (window.paypal) {
            console.log('PayPal SDK already loaded');
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CONFIG.clientId}&currency=${PAYPAL_CONFIG.currency}`;
            script.onload = () => {
                console.log('PayPal SDK loaded successfully');
                resolve();
            };
            script.onerror = () => {
                console.error('Failed to load PayPal SDK');
                reject(new Error('PayPal SDK failed to load'));
            };
            document.head.appendChild(script);
        });
    };

    // Create PayPal payment button
    const createPayPalButton = (containerId, onSuccess) => {
        if (!window.paypal) {
            console.error('PayPal SDK not loaded');
            return;
        }

        window.paypal.Buttons({
            style: {
                layout: 'vertical',
                color: 'blue',
                shape: 'rect',
                label: 'pay',
                height: 40
            },
            createOrder: (data, actions) => {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: PAYPAL_CONFIG.amount,
                            currency_code: PAYPAL_CONFIG.currency
                        },
                        description: PAYPAL_CONFIG.description
                    }]
                });
            },
            onApprove: async (data, actions) => {
                try {
                    const order = await actions.order.capture();
                    console.log('Payment successful:', order);
                    
                    // Update payment status
                    paymentStatus = {
                        isPaid: true,
                        transactionId: order.id,
                        paymentDate: new Date().toISOString(),
                        sessionActive: true
                    };
                    savePaymentStatus(paymentStatus);

                    // Enable preview interaction immediately
                    enablePreviewInteraction();

                    // Call success callback
                    if (onSuccess) {
                        onSuccess(order);
                    }

                    return order;
                } catch (error) {
                    console.error('Payment capture failed:', error);
                    alert('Payment processing failed. Please try again.');
                }
            },
            onError: (err) => {
                console.error('PayPal payment error:', err);
                alert('Payment failed. Please try again or contact support.');
            },
            onCancel: (data) => {
                console.log('Payment cancelled by user:', data);
            }
        }).render(`#${containerId}`);
    };

    // Backup form data before payment
    const backupFormData = (formData) => {
        formDataBackup = JSON.parse(JSON.stringify(formData));
        console.log('Form data backed up for payment process');
    };

    // Restore form data after payment
    const restoreFormData = () => {
        if (formDataBackup) {
            console.log('Form data restored after payment');
            return formDataBackup;
        }
        return null;
    };

    // Check if user has paid in current session
    const hasAccess = () => {
        return paymentStatus.isPaid && paymentStatus.sessionActive;
    };

    // Create paywall modal
    const createPaywallModal = (onPaymentSuccess) => {
        // Remove existing modal if present
        const existingModal = document.getElementById('paywall-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create modal HTML
        const modal = document.createElement('div');
        modal.id = 'paywall-modal';
        modal.innerHTML = `
            <div class="paywall-overlay">
                <div class="paywall-modal">
                    <div class="paywall-header">
                        <h2>🔒 Access Premium Features</h2>
                        <button class="paywall-close" onclick="PaywallSystem.closePaywallModal()">&times;</button>
                    </div>
                    <div class="paywall-content">
                        <div class="paywall-features">
                            <h3>What You Get:</h3>
                            <ul>
                                <li>✅ Professional demand letter with 30-day arbitration notice</li>
                                <li>✅ Optional AAA arbitration demand attachment</li>
                                <li>✅ Copy to clipboard functionality</li>
                                <li>✅ Download as MS Word document</li>
                                <li>✅ Legally compliant with Stripe's Services Agreement</li>
                                <li>✅ Based on California attorney expertise</li>
                                <li>✅ Instant access - no waiting</li>
                            </ul>
                        </div>
                        <div class="paywall-price">
                            <div class="price-display">
                                <span class="currency">$</span>
                                <span class="amount">${PAYPAL_CONFIG.amount}</span>
                                <span class="description">One-time payment</span>
                            </div>
                        </div>
                        <div class="paywall-payment">
                            <p><strong>Secure Payment via PayPal:</strong></p>
                            <div id="paypal-button-container"></div>
                            <div class="paywall-manual-entry">
                                <p style="margin: 15px 0 10px; font-size: 14px; color: #6c757d; text-align: center;">
                                    Already paid? Enter your PayPal transaction ID:
                                </p>
                                <input type="text" id="manual-paypal-id" placeholder="Enter PayPal transaction ID" 
                                       style="width: 100%; padding: 10px; border: 1px solid #ced4da; border-radius: 4px; margin-bottom: 10px; font-size: 14px;">
                                <button onclick="PaywallSystem.validateManualPayPalId()" 
                                        style="width: 100%; padding: 10px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">
                                    Verify & Unlock Access
                                </button>
                            </div>
                        </div>
                        <div class="paywall-security">
                            <p>🔒 Secure payment processing by PayPal • No subscription • One-time purchase</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add modal styles
        const styles = `
            <style>
                .paywall-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 10000;
                    backdrop-filter: blur(5px);
                }
                .paywall-modal {
                    background: white;
                    border-radius: 12px;
                    max-width: 500px;
                    width: 90%;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    animation: paywallSlideIn 0.3s ease-out;
                }
                @keyframes paywallSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-50px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                .paywall-header {
                    background: linear-gradient(135deg, #4f46e5, #2563eb);
                    color: white;
                    padding: 20px;
                    border-radius: 12px 12px 0 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .paywall-header h2 {
                    margin: 0;
                    font-size: 1.5rem;
                    font-weight: 600;
                }
                .paywall-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 24px;
                    cursor: pointer;
                    padding: 0;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: background-color 0.2s;
                }
                .paywall-close:hover {
                    background-color: rgba(255, 255, 255, 0.2);
                }
                .paywall-content {
                    padding: 30px;
                }
                .paywall-features {
                    margin-bottom: 25px;
                }
                .paywall-features h3 {
                    color: #2c3e50;
                    margin-bottom: 15px;
                    font-size: 1.2rem;
                }
                .paywall-features ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                .paywall-features li {
                    padding: 8px 0;
                    color: #34495e;
                    font-size: 14px;
                    border-bottom: 1px solid #ecf0f1;
                }
                .paywall-features li:last-child {
                    border-bottom: none;
                }
                .paywall-price {
                    text-align: center;
                    margin: 25px 0;
                    padding: 20px;
                    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                    border-radius: 8px;
                    border: 2px solid #28a745;
                }
                .price-display {
                    display: flex;
                    align-items: baseline;
                    justify-content: center;
                    gap: 5px;
                }
                .currency {
                    font-size: 1.5rem;
                    color: #28a745;
                    font-weight: 600;
                }
                .amount {
                    font-size: 3rem;
                    color: #28a745;
                    font-weight: 700;
                    line-height: 1;
                }
                .description {
                    font-size: 1rem;
                    color: #6c757d;
                    margin-left: 10px;
                    align-self: center;
                }
                .paywall-payment {
                    margin: 25px 0;
                }
                .paywall-payment p {
                    text-align: center;
                    margin-bottom: 15px;
                    color: #2c3e50;
                    font-weight: 500;
                }
                #paypal-button-container {
                    min-height: 50px;
                }
                .paywall-manual-entry {
                    background: #f8f9fa;
                    border: 1px solid #e9ecef;
                    border-radius: 6px;
                    padding: 15px;
                    margin: 15px 0;
                    text-align: center;
                }
                .paywall-manual-entry input {
                    font-family: inherit;
                    transition: border-color 0.3s, box-shadow 0.3s;
                }
                .paywall-manual-entry input:focus {
                    border-color: #007bff;
                    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
                    outline: none;
                }
                .paywall-manual-entry button:hover {
                    background: #0056b3;
                    transform: translateY(-1px);
                }
                .paywall-security {
                    text-align: center;
                    margin-top: 20px;
                }
                .paywall-security p {
                    margin: 0;
                    color: #6c757d;
                    font-size: 12px;
                    font-style: italic;
                }
            </style>
        `;

        // Add styles to document head
        if (!document.getElementById('paywall-styles')) {
            const styleElement = document.createElement('div');
            styleElement.id = 'paywall-styles';
            styleElement.innerHTML = styles;
            document.head.appendChild(styleElement);
        }

        // Add modal to document
        document.body.appendChild(modal);

        // Initialize PayPal button after modal is rendered
        setTimeout(() => {
            createPayPalButton('paypal-button-container', (order) => {
                // Payment successful
                modal.remove();
                if (onPaymentSuccess) {
                    onPaymentSuccess(order);
                }
            });
        }, 100);

        return modal;
    };

    // Close paywall modal
    const closePaywallModal = () => {
        const modal = document.getElementById('paywall-modal');
        if (modal) {
            modal.remove();
        }
    };

    // Manual PayPal ID validation for backup access
    const validateManualPayPalId = () => {
        const input = document.getElementById('manual-paypal-id');
        if (!input) return;
        
        const paypalId = input.value.trim();
        
        // Basic PayPal transaction ID validation
        // PayPal transaction IDs are typically 17 characters, alphanumeric
        if (paypalId.length >= 10 && /^[A-Z0-9]+$/i.test(paypalId)) {
            // Update payment status
            paymentStatus = {
                isPaid: true,
                transactionId: paypalId,
                paymentDate: new Date().toISOString(),
                sessionActive: true,
                manualEntry: true
            };
            savePaymentStatus(paymentStatus);

            // Close modal and trigger success
            const modal = document.getElementById('paywall-modal');
            if (modal) {
                modal.remove();
            }

            // Enable preview interaction immediately
            enablePreviewInteraction();
            
            // Show success message
            alert('Access unlocked! You can now copy and download your demand letter.');
            
            // Trigger any pending callbacks
            if (window.manualUnlockCallback) {
                window.manualUnlockCallback();
                window.manualUnlockCallback = null;
            }
        } else {
            alert('Please enter a valid PayPal transaction ID. Transaction IDs are typically 10+ characters and contain only letters and numbers.');
            input.focus();
        }
    };

    // Show access denied message for copy/download attempts
    const showAccessDenied = (actionType = 'action') => {
        // Create toast notification
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #dc3545;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 9999;
            max-width: 350px;
            animation: slideInRight 0.3s ease-out;
        `;
        
        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 20px;">🔒</span>
                <div>
                    <strong>Payment Required</strong>
                    <div style="font-size: 14px; margin-top: 5px;">
                        ${actionType === 'copy' ? 'Copy to clipboard' : 
                          actionType === 'download' ? 'Download document' : 'This feature'} 
                        requires payment. Complete your purchase to unlock full access.
                    </div>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: none; border: none; color: white; font-size: 18px; cursor: pointer; padding: 0; margin-left: auto;">×</button>
            </div>
        `;

        // Add slide-in animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(toast);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 5000);
    };

    // Make preview content non-selectable and non-copyable
    const makePreviewNonCopyable = () => {
        const previewElements = document.querySelectorAll('.document-preview, .preview-content');
        previewElements.forEach(element => {
            element.style.cssText += `
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
                -webkit-touch-callout: none;
                -webkit-tap-highlight-color: transparent;
                pointer-events: none;
            `;
            
            // Add overlay to prevent interaction
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 10;
                cursor: not-allowed;
                background: linear-gradient(45deg, 
                    rgba(255,255,255,0.05) 25%, 
                    transparent 25%, 
                    transparent 50%, 
                    rgba(255,255,255,0.05) 50%, 
                    rgba(255,255,255,0.05) 75%, 
                    transparent 75%
                );
                background-size: 30px 30px;
            `;
            
            // Make parent relative for overlay positioning
            if (getComputedStyle(element.parentElement).position === 'static') {
                element.parentElement.style.position = 'relative';
            }
            
            element.parentElement.appendChild(overlay);
            
            // Add click handler to overlay
            overlay.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                showAccessDenied('preview');
            });
        });
    };

    // Remove preview restrictions after payment
    const enablePreviewInteraction = () => {
        console.log('enablePreviewInteraction called');
        
        // Remove restrictions from preview elements
        const previewElements = document.querySelectorAll('.document-preview, .preview-content');
        previewElements.forEach(element => {
            // Clear all the restricting styles
            element.style.webkitUserSelect = '';
            element.style.mozUserSelect = '';
            element.style.msUserSelect = '';
            element.style.userSelect = '';
            element.style.webkitTouchCallout = '';
            element.style.webkitTapHighlightColor = '';
            element.style.pointerEvents = '';
        });

        // Remove all overlays more aggressively
        const allOverlays = document.querySelectorAll('div[style*="position: absolute"]');
        allOverlays.forEach(overlay => {
            // Check if this overlay looks like our paywall overlay
            const style = overlay.style.cssText;
            if (style.includes('cursor: not-allowed') || 
                style.includes('z-index: 10') || 
                style.includes('linear-gradient(45deg')) {
                console.log('Removing paywall overlay');
                overlay.remove();
            }
        });

        // Also remove any elements with preview-overlay class
        const classOverlays = document.querySelectorAll('.preview-overlay');
        classOverlays.forEach(overlay => overlay.remove());
    };

    // Public API
    return {
        initializePayPal,
        createPaywallModal,
        closePaywallModal,
        validateManualPayPalId,
        hasAccess,
        backupFormData,
        restoreFormData,
        showAccessDenied,
        makePreviewNonCopyable,
        enablePreviewInteraction,
        getPaymentStatus: () => paymentStatus
    };
})();

// Make PaywallSystem globally available
window.PaywallSystem = PaywallSystem;