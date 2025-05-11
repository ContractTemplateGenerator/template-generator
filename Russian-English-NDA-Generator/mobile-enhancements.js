// Mobile-specific JavaScript enhancements for NDA Generator

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on a mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    
    if (isMobile) {
        // Add mobile class to body
        document.body.classList.add('mobile-device');
        
        // Initialize mobile-specific features
        initMobileFeatures();
    }
    
    // Handle orientation changes
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleResize);
});

function initMobileFeatures() {
    // Make preview section collapsible
    setupCollapsiblePreview();
    
    // Add swipe gestures for tab navigation
    setupSwipeNavigation();
    
    // Optimize form inputs for mobile
    optimizeFormInputs();
    
    // Add touch feedback
    addTouchFeedback();
    
    // Setup mobile tooltips
    setupMobileTooltips();
    
    // Add scroll to top button
    addScrollToTopButton();
}

function setupCollapsiblePreview() {
    const previewSection = document.querySelector('.preview-section');
    if (previewSection) {
        // Add collapsible functionality
        const previewHeader = document.createElement('div');
        previewHeader.className = 'preview-header mobile-only';
        previewHeader.innerHTML = '<span>📄 Live Preview</span><span class="toggle-icon">▼</span>';
        
        previewSection.insertBefore(previewHeader, previewSection.firstChild);
        
        previewHeader.addEventListener('click', function() {
            previewSection.classList.toggle('collapsed');
            const toggleIcon = previewHeader.querySelector('.toggle-icon');
            toggleIcon.textContent = previewSection.classList.contains('collapsed') ? '▲' : '▼';
        });
        
        // Start collapsed on mobile
        previewSection.classList.add('collapsed');
    }
}

function setupSwipeNavigation() {
    const tabsContainer = document.querySelector('.tabs');
    if (!tabsContainer) return;
    
    let touchStartX = 0;
    let touchEndX = 0;
    
    tabsContainer.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    tabsContainer.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeDistance = touchStartX - touchEndX;
        const minSwipeDistance = 50;
        
        if (Math.abs(swipeDistance) > minSwipeDistance) {
            // Get current active tab
            const activeTab = document.querySelector('.tab.active');
            const tabs = Array.from(document.querySelectorAll('.tab'));
            const currentIndex = tabs.indexOf(activeTab);
            
            if (swipeDistance > 0 && currentIndex < tabs.length - 1) {
                // Swipe left - go to next tab
                tabs[currentIndex + 1].click();
            } else if (swipeDistance < 0 && currentIndex > 0) {
                // Swipe right - go to previous tab
                tabs[currentIndex - 1].click();
            }
        }
    }
}

function optimizeFormInputs() {
    // Auto-zoom to inputs on focus for better visibility
    const inputs = document.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            if (window.innerWidth <= 576) {
                // Scroll input into center of viewport
                setTimeout(() => {
                    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }
        });
    });
    
    // Add clear buttons to text inputs
    const textInputs = document.querySelectorAll('input[type="text"], textarea');
    textInputs.forEach(input => {
        const wrapper = document.createElement('div');
        wrapper.className = 'input-wrapper';
        input.parentNode.insertBefore(wrapper, input);
        wrapper.appendChild(input);
        
        const clearButton = document.createElement('button');
        clearButton.className = 'clear-input';
        clearButton.innerHTML = '✕';
        clearButton.style.display = 'none';
        wrapper.appendChild(clearButton);
        
        input.addEventListener('input', function() {
            clearButton.style.display = this.value ? 'block' : 'none';
        });
        
        clearButton.addEventListener('click', function(e) {
            e.preventDefault();
            input.value = '';
            clearButton.style.display = 'none';
            input.focus();
        });
    });
}

function addTouchFeedback() {
    // Add haptic feedback for supported devices
    const buttons = document.querySelectorAll('.btn, .tab');
    
    buttons.forEach(button => {
        button.addEventListener('touchstart', function() {
            if ('vibrate' in navigator) {
                navigator.vibrate(10);
            }
            this.classList.add('touch-active');
        });
        
        button.addEventListener('touchend', function() {
            this.classList.remove('touch-active');
        });
    });
}

function setupMobileTooltips() {
    const helpIcons = document.querySelectorAll('.help-icon');
    
    helpIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Close any open tooltips
            document.querySelectorAll('.help-tooltip.mobile-visible').forEach(tooltip => {
                tooltip.classList.remove('mobile-visible');
            });
            
            // Show this tooltip
            const tooltip = this.querySelector('.help-tooltip');
            tooltip.classList.add('mobile-visible');
            
            // Add backdrop
            const backdrop = document.createElement('div');
            backdrop.className = 'tooltip-backdrop';
            document.body.appendChild(backdrop);
            
            backdrop.addEventListener('click', function() {
                tooltip.classList.remove('mobile-visible');
                backdrop.remove();
            });
        });
    });
}

function addScrollToTopButton() {
    const scrollButton = document.createElement('button');
    scrollButton.className = 'scroll-to-top';
    scrollButton.innerHTML = '↑';
    scrollButton.style.display = 'none';
    document.body.appendChild(scrollButton);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollButton.style.display = 'block';
        } else {
            scrollButton.style.display = 'none';
        }
    });
    
    scrollButton.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function handleOrientationChange() {
    // Adjust layout based on orientation
    const orientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
    document.body.setAttribute('data-orientation', orientation);
    
    // Re-calculate viewport height for iOS
    if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
        document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    }
}

function handleResize() {
    // Debounce resize events
    let resizeTimer;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        // Re-initialize mobile features if needed
        const wasMobile = document.body.classList.contains('mobile-device');
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile && !wasMobile) {
            document.body.classList.add('mobile-device');
            initMobileFeatures();
        } else if (!isMobile && wasMobile) {
            document.body.classList.remove('mobile-device');
            // Clean up mobile-specific features
        }
    }, 250);
}

// Additional mobile utility functions
const mobileUtils = {
    // Smooth scroll to element
    scrollToElement: function(element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    
    // Check if element is in viewport
    isInViewport: function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },
    
    // Debounce function for performance
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Export for use in main app
window.mobileUtils = mobileUtils;
