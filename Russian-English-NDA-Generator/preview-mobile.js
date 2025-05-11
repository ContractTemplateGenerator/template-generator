// Mobile preview handling
document.addEventListener('DOMContentLoaded', function() {
    // Only apply on mobile devices
    if (window.innerWidth <= 768) {
        setupMobilePreview();
    }
    
    // Re-check on resize
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) {
            setupMobilePreview();
        } else {
            removeMobilePreview();
        }
    });
});

function setupMobilePreview() {
    const previewSection = document.querySelector('.preview-section');
    if (!previewSection) return;
    
    // Check if header already exists
    let previewHeader = previewSection.querySelector('.preview-header');
    if (!previewHeader) {
        // Create collapsible header
        previewHeader = document.createElement('div');
        previewHeader.className = 'preview-header';
        previewHeader.innerHTML = `
            <span>Live Preview</span>
            <span class="toggle-icon">▼</span>
        `;
        
        // Insert at the beginning of preview section
        previewSection.insertBefore(previewHeader, previewSection.firstChild);
        
        // Add click handler
        previewHeader.addEventListener('click', function() {
            previewSection.classList.toggle('collapsed');
            const icon = previewHeader.querySelector('.toggle-icon');
            if (previewSection.classList.contains('collapsed')) {
                icon.textContent = '▲';
            } else {
                icon.textContent = '▼';
            }
        });
        
        // Start collapsed on mobile
        previewSection.classList.add('collapsed');
        previewHeader.querySelector('.toggle-icon').textContent = '▲';
    }
}

function removeMobilePreview() {
    const previewSection = document.querySelector('.preview-section');
    if (!previewSection) return;
    
    // Remove collapsed state
    previewSection.classList.remove('collapsed');
    
    // Remove header if it exists
    const previewHeader = previewSection.querySelector('.preview-header');
    if (previewHeader) {
        previewHeader.remove();
    }
}

// Fix for help icons on mobile
function fixHelpIcons() {
    const helpIcons = document.querySelectorAll('.help-icon');
    
    helpIcons.forEach(icon => {
        // Ensure proper spacing
        const parent = icon.parentElement;
        if (parent.classList.contains('checkbox-label')) {
            // Move help icon to the end of the label
            parent.appendChild(icon);
        }
    });
}

// Run fixes on load
document.addEventListener('DOMContentLoaded', fixHelpIcons);
