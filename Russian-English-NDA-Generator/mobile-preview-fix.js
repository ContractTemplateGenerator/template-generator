// Mobile Preview Fix
document.addEventListener('DOMContentLoaded', function() {
    // Only run on mobile
    if (window.innerWidth <= 414) {
        fixMobilePreview();
        fixHelpIcons();
        fixLabels();
    }
    
    // Re-run on orientation change
    window.addEventListener('orientationchange', function() {
        setTimeout(function() {
            if (window.innerWidth <= 414) {
                fixMobilePreview();
                fixHelpIcons();
                fixLabels();
            }
        }, 100);
    });
});

function fixMobilePreview() {
    const previewSection = document.querySelector('.preview-section');
    if (!previewSection) return;
    
    // Make sure preview has a proper container
    let previewContent = previewSection.querySelector('.preview-content');
    if (!previewContent) {
        previewContent = document.createElement('div');
        previewContent.className = 'preview-content';
        
        // Move all content into the preview content div
        while (previewSection.firstChild) {
            previewContent.appendChild(previewSection.firstChild);
        }
        
        previewSection.appendChild(previewContent);
    }
    
    // Add or update header
    let previewHeader = previewSection.querySelector('.preview-header');
    if (!previewHeader) {
        previewHeader = document.createElement('div');
        previewHeader.className = 'preview-header';
        previewHeader.innerHTML = `
            <span>Live Preview</span>
            <span class="toggle-icon">▼</span>
        `;
        
        previewSection.insertBefore(previewHeader, previewSection.firstChild);
        
        // Add toggle functionality
        previewHeader.addEventListener('click', function() {
            previewSection.classList.toggle('collapsed');
            const icon = previewHeader.querySelector('.toggle-icon');
            icon.textContent = previewSection.classList.contains('collapsed') ? '▲' : '▼';
        });
    }
    
    // Remove any duplicate h2 titles
    const duplicateTitles = previewContent.querySelectorAll('h2');
    duplicateTitles.forEach(title => {
        if (title.textContent.includes('Live Preview')) {
            title.style.display = 'none';
        }
    });
    
    // Ensure preview content is properly contained
    const previewDocument = previewContent.querySelector('#preview-document');
    if (previewDocument) {
        previewDocument.style.maxHeight = '350px';
        previewDocument.style.overflowY = 'auto';
        previewDocument.style.overflowX = 'hidden';
        previewDocument.style.padding = '10px';
    }
}

function fixHelpIcons() {
    // Fix help icons in regular labels
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        const label = group.querySelector('label');
        const helpIcon = group.querySelector('.help-icon');
        
        if (label && helpIcon) {
            // Remove help icon from label and add it to form group
            if (label.contains(helpIcon)) {
                label.removeChild(helpIcon);
                group.appendChild(helpIcon);
                
                // Position it absolutely
                group.style.position = 'relative';
                helpIcon.style.position = 'absolute';
                helpIcon.style.right = '5px';
                helpIcon.style.top = '0';
            }
        }
    });
    
    // Fix help icons in checkbox labels
    const checkboxLabels = document.querySelectorAll('.checkbox-label');
    checkboxLabels.forEach(label => {
        const helpIcon = label.querySelector('.help-icon');
        
        if (helpIcon) {
            // Ensure it's positioned absolutely
            label.style.position = 'relative';
            helpIcon.style.position = 'absolute';
            helpIcon.style.right = '0';
            helpIcon.style.top = '0';
            helpIcon.style.margin = '0';
        }
        
        // Wrap the text content
        const textNodes = Array.from(label.childNodes).filter(node => 
            node.nodeType === Node.TEXT_NODE && node.textContent.trim()
        );
        
        textNodes.forEach(node => {
            const span = document.createElement('span');
            span.textContent = node.textContent;
            node.replaceWith(span);
        });
    });
}

function fixLabels() {
    // Fix cut-off labels
    const labels = document.querySelectorAll('label');
    labels.forEach(label => {
        label.style.wordWrap = 'break-word';
        label.style.whiteSpace = 'normal';
        label.style.overflow = 'visible';
        
        // Add padding to prevent help icon overlap
        if (label.querySelector('.help-icon') || label.parentElement.querySelector('.help-icon')) {
            label.style.paddingRight = '35px';
        }
    });
    
    // Fix input placeholders
    const inputs = document.querySelectorAll('input[type="text"]');
    inputs.forEach(input => {
        if (input.placeholder) {
            // Shorten placeholders if needed
            if (input.placeholder.length > 25) {
                input.style.fontSize = '14px';
            }
        }
    });
}

// Additional mobile tooltip handling
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('help-icon')) {
        e.preventDefault();
        e.stopPropagation();
        
        // Close any open tooltips
        document.querySelectorAll('.help-tooltip.visible').forEach(tooltip => {
            tooltip.classList.remove('visible');
        });
        
        // Show this tooltip
        const tooltip = e.target.querySelector('.help-tooltip');
        if (tooltip) {
            tooltip.classList.add('visible');
            
            // Add backdrop
            let backdrop = document.querySelector('.tooltip-backdrop');
            if (!backdrop) {
                backdrop = document.createElement('div');
                backdrop.className = 'tooltip-backdrop';
                backdrop.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    z-index: 999;
                `;
                document.body.appendChild(backdrop);
            }
            
            backdrop.addEventListener('click', function() {
                tooltip.classList.remove('visible');
                backdrop.remove();
            });
        }
    }
});
