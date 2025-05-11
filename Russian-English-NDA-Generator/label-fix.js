// Fix for label visibility on mobile
document.addEventListener('DOMContentLoaded', function() {
    if (window.innerWidth <= 414) {
        fixLabels();
    }
    
    // Also fix on tab change
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('tab')) {
            setTimeout(fixLabels, 100);
        }
    });
});

function fixLabels() {
    // Ensure all labels are visible
    const labels = document.querySelectorAll('.form-group label:not(.checkbox-label)');
    
    labels.forEach(label => {
        // Make sure label is visible
        label.style.display = 'block';
        label.style.visibility = 'visible';
        label.style.opacity = '1';
        label.style.color = '#333';
        label.style.marginBottom = '8px';
        label.style.fontSize = '0.95rem';
        label.style.fontWeight = '600';
        
        // Get the text content and make sure it's visible
        const textContent = label.textContent || label.innerText;
        
        // If label text is empty or just contains a help icon, try to restore it
        if (!textContent || textContent.trim() === '?' || textContent.trim() === '') {
            const forAttr = label.getAttribute('for');
            
            if (forAttr) {
                // Set proper label text based on the field
                const labelTexts = {
                    'discloserName': 'Disclosing Party Name:',
                    'discloserAddress': 'Disclosing Party Address:',
                    'recipientName': 'Receiving Party Name:',
                    'recipientAddress': 'Receiving Party Address:',
                    'effectiveDate': 'Effective Date:',
                    'purpose': 'Purpose of Disclosure:',
                    'customPurpose': 'Specify Purpose:',
                    'confInfoType': 'Definition of Confidential Information:',
                    'customConfInfo': 'Custom Definition:',
                    'protectionPeriod': 'Protection Period (years):',
                    'terminationNotice': 'Termination Notice Period (days):',
                    'governingLaw': 'Governing Law:',
                    'controllingLanguage': 'Legally Controlling Language:'
                };
                
                const labelText = labelTexts[forAttr];
                if (labelText) {
                    // Check if label has a help icon
                    const helpIcon = label.querySelector('.help-icon');
                    
                    if (helpIcon) {
                        // Create text node before help icon
                        const textNode = document.createTextNode(labelText);
                        label.insertBefore(textNode, helpIcon);
                    } else {
                        // Just set the text
                        label.textContent = labelText;
                    }
                }
            }
        }
        
        // Fix help icon positioning
        const helpIcon = label.querySelector('.help-icon');
        if (helpIcon) {
            const formGroup = label.closest('.form-group');
            if (formGroup) {
                // Move help icon out of label and position it absolutely
                label.removeChild(helpIcon);
                formGroup.appendChild(helpIcon);
                
                formGroup.style.position = 'relative';
                helpIcon.style.position = 'absolute';
                helpIcon.style.right = '0';
                helpIcon.style.top = '0';
                helpIcon.style.zIndex = '10';
            }
        }
    });
    
    // Also ensure form groups have proper structure
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        group.style.marginBottom = '25px';
        group.style.position = 'relative';
        
        // Ensure inputs are below labels
        const input = group.querySelector('input, select, textarea');
        if (input) {
            input.style.marginTop = '0';
            input.style.width = '100%';
        }
    });
}

// Additional fix for React rendering
function waitForReactAndFix() {
    // Wait a bit for React to finish rendering
    setTimeout(function() {
        fixLabels();
        
        // Also fix when switching tabs
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                setTimeout(fixLabels, 200);
            });
        });
    }, 500);
}

// Call the fix after a short delay to ensure React has rendered
if (document.readyState === 'complete') {
    waitForReactAndFix();
} else {
    window.addEventListener('load', waitForReactAndFix);
}
