// Tablet-specific enhancements
document.addEventListener('DOMContentLoaded', function() {
    // Check if device is a tablet
    const isTablet = window.innerWidth >= 768 && window.innerWidth <= 1024;
    
    if (isTablet) {
        initTabletFeatures();
    }
    
    // Handle orientation changes
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleResize);
});

function initTabletFeatures() {
    // Add tablet class to body
    document.body.classList.add('tablet-device');
    
    // Initialize split-screen layout
    setupSplitScreen();
    
    // Enhance touch interactions
    enhanceTouchInteractions();
    
    // Setup swipe gestures
    setupSwipeGestures();
    
    // Optimize scrolling
    optimizeScrolling();
    
    // Setup keyboard handling for iPads
    setupKeyboardHandling();
}

function setupSplitScreen() {
    const contentContainer = document.querySelector('.content-container');
    if (!contentContainer) return;
    
    // Check orientation
    const isPortrait = window.innerHeight > window.innerWidth;
    
    if (isPortrait) {
        // Stack form and preview vertically in portrait
        contentContainer.style.flexDirection = 'column';
    } else {
        // Side-by-side in landscape
        contentContainer.style.flexDirection = 'row';
    }
    
    // Make preview sticky in landscape
    const previewSection = document.querySelector('.preview-section');
    if (previewSection && !isPortrait) {
        previewSection.style.position = 'sticky';
        previewSection.style.top = '20px';
    }
}

function enhanceTouchInteractions() {
    // Add touch feedback to interactive elements
    const interactiveElements = document.querySelectorAll('.btn, .tab, .checkbox-label, .help-icon');
    
    interactiveElements.forEach(element => {
        element.addEventListener('touchstart', function(e) {
            this.classList.add('touch-active');
        });
        
        element.addEventListener('touchend', function(e) {
            this.classList.remove('touch-active');
        });
        
        // Prevent ghost clicks
        element.addEventListener('touchend', function(e) {
            e.preventDefault();
            this.click();
        });
    });
    
    // Improve checkbox usability
    const checkboxLabels = document.querySelectorAll('.checkbox-label');
    checkboxLabels.forEach(label => {
        label.style.cursor = 'pointer';
        label.addEventListener('click', function(e) {
            if (e.target.tagName !== 'INPUT') {
                const checkbox = this.querySelector('input[type="checkbox"]');
                if (checkbox) {
                    checkbox.checked = !checkbox.checked;
                    // Trigger change event
                    const event = new Event('change', { bubbles: true });
                    checkbox.dispatchEvent(event);
                }
            }
        });
    });
}

function setupSwipeGestures() {
    const tabsContainer = document.querySelector('.tabs');
    if (!tabsContainer) return;
    
    let touchStartX = 0;
    let touchEndX = 0;
    
    tabsContainer.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    tabsContainer.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleTabSwipe();
    });
    
    function handleTabSwipe() {
        const swipeDistance = touchStartX - touchEndX;
        const minSwipeDistance = 75; // Larger swipe distance for tablets
        
        if (Math.abs(swipeDistance) > minSwipeDistance) {
            const tabs = Array.from(document.querySelectorAll('.tab'));
            const activeTab = document.querySelector('.tab.active');
            const currentIndex = tabs.indexOf(activeTab);
            
            if (swipeDistance > 0 && currentIndex < tabs.length - 1) {
                // Swipe left - next tab
                tabs[currentIndex + 1].click();
            } else if (swipeDistance < 0 && currentIndex > 0) {
                // Swipe right - previous tab
                tabs[currentIndex - 1].click();
            }
        }
    }
}

function optimizeScrolling() {
    // Enable momentum scrolling
    const scrollableElements = document.querySelectorAll('.preview-section, .instruction-screen, .tabs');
    
    scrollableElements.forEach(element => {
        element.style.webkitOverflowScrolling = 'touch';
        element.style.overflowScrolling = 'touch';
    });
    
    // Sync scroll position between form and preview on tablets
    const formSection = document.querySelector('.form-section');
    const previewSection = document.querySelector('.preview-section');
    
    if (formSection && previewSection && window.innerWidth >= 900) {
        let syncing = false;
        
        formSection.addEventListener('scroll', function() {
            if (!syncing) {
                syncing = true;
                const scrollPercentage = this.scrollTop / (this.scrollHeight - this.clientHeight);
                previewSection.scrollTop = scrollPercentage * (previewSection.scrollHeight - previewSection.clientHeight);
                setTimeout(() => syncing = false, 100);
            }
        });
    }
}

function setupKeyboardHandling() {
    // Handle virtual keyboard on iPads
    const inputs = document.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            // Scroll the input into view when keyboard appears
            setTimeout(() => {
                this.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        });
    });
    
    // Handle keyboard dismiss
    document.addEventListener('touchstart', function(e) {
        if (!e.target.closest('input, select, textarea, .btn')) {
            // Blur active element to hide keyboard
            document.activeElement.blur();
        }
    });
}

function handleOrientationChange() {
    // Wait for orientation change to complete
    setTimeout(() => {
        const isTablet = window.innerWidth >= 768 && window.innerWidth <= 1024;
        
        if (isTablet) {
            setupSplitScreen();
            
            // Adjust preview height
            const previewSection = document.querySelector('.preview-section');
            if (previewSection) {
                const isPortrait = window.innerHeight > window.innerWidth;
                if (isPortrait) {
                    previewSection.style.height = 'auto';
                    previewSection.style.minHeight = '400px';
                } else {
                    previewSection.style.height = 'calc(100vh - 200px)';
                }
            }
        }
    }, 100);
}

function handleResize() {
    // Debounce resize events
    let resizeTimer;
    clearTimeout(resizeTimer);
    
    resizeTimer = setTimeout(function() {
        const wasTablet = document.body.classList.contains('tablet-device');
        const isTablet = window.innerWidth >= 768 && window.innerWidth <= 1024;
        
        if (isTablet && !wasTablet) {
            document.body.classList.add('tablet-device');
            initTabletFeatures();
        } else if (!isTablet && wasTablet) {
            document.body.classList.remove('tablet-device');
            // Clean up tablet-specific features
            cleanupTabletFeatures();
        }
    }, 250);
}

function cleanupTabletFeatures() {
    // Remove tablet-specific event listeners and classes
    document.body.classList.remove('tablet-device');
    
    // Reset styles
    const contentContainer = document.querySelector('.content-container');
    if (contentContainer) {
        contentContainer.style.flexDirection = '';
    }
    
    const previewSection = document.querySelector('.preview-section');
    if (previewSection) {
        previewSection.style.position = '';
        previewSection.style.top = '';
        previewSection.style.height = '';
    }
}

// iPad-specific optimizations
if (/iPad/.test(navigator.userAgent)) {
    document.addEventListener('DOMContentLoaded', function() {
        // Add iPad class for specific styling
        document.body.classList.add('ipad-device');
        
        // Handle iPad-specific viewport issues
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        }
        
        // Fix for iPad keyboard overlaying content
        window.addEventListener('focusin', function(e) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                // Delay to wait for keyboard
                setTimeout(() => {
                    window.scrollTo(0, e.target.offsetTop - 100);
                }, 500);
            }
        });
    });
}
