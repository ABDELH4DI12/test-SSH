// Check if Meta Pixel is loaded
function checkPixelStatus() {
    const statusElement = document.getElementById('pixel-status');
    
    setTimeout(() => {
        if (typeof fbq !== 'undefined') {
            statusElement.innerHTML = '<span class="connected">✓ Meta Pixel Connected</span>';
            console.log('✓ Meta Pixel is loaded and ready');
            console.log('Pixel ID: 2077516539788729');
        } else {
            statusElement.innerHTML = '<span class="error">✗ Meta Pixel Not Loaded</span>';
            console.error('✗ Meta Pixel failed to load');
        }
    }, 1000);
}

// Track custom events
function trackCustomEvent(eventName) {
    if (typeof fbq !== 'undefined') {
        fbq('track', eventName);
        console.log(`✓ Event tracked: ${eventName}`);
        
        // Visual feedback
        showNotification(`${eventName} event tracked!`);
    } else {
        console.error('Meta Pixel is not loaded');
        showNotification('Error: Pixel not loaded', true);
    }
}

// Show notification
function showNotification(message, isError = false) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${isError ? '#dc3545' : '#28a745'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize on page load
window.addEventListener('load', () => {
    checkPixelStatus();
    console.log('Page loaded - Meta Pixel should be tracking PageView');
});
