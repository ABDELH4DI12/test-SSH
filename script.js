// ===== CHECK PIXEL STATUS =====
function checkPixelStatus() {
    const statusElement = document.getElementById('pixel-status');

    setTimeout(() => {
        if (typeof fbq !== 'undefined') {
            statusElement.innerHTML = '<span class="connected">✓ Meta Pixel Connected</span>';
            console.log('✓ Meta Pixel is loaded');
        } else {
            statusElement.innerHTML = '<span class="error">✗ Meta Pixel Not Loaded</span>';
            console.error('✗ Meta Pixel failed to load');
        }
    }, 1000);
}

// ===== TRACK EVENTS (FIXED) =====
function trackEvent(eventName) {
    if (typeof fbq === 'undefined') {
        console.error('❌ Pixel not loaded');
        showNotification('Pixel not loaded', true);
        return;
    }

    switch (eventName) {

        case 'ViewContent':
            fbq('track', 'ViewContent', {
                content_name: 'Test Product',
                content_category: 'Test Category',
                value: 10.0,
                currency: 'USD'
            });
            break;

        case 'AddToCart':
            fbq('track', 'AddToCart', {
                content_name: 'Test Product',
                content_ids: ['123'],
                content_type: 'product',
                value: 10.0,
                currency: 'USD'
            });
            break;

        case 'Purchase':
            fbq('track', 'Purchase', {
                value: 10.0,
                currency: 'USD'
            });
            break;

        default:
            fbq('trackCustom', eventName);
    }

    console.log(`✓ Event tracked: ${eventName}`);
    showNotification(`${eventName} sent`);
}

// ===== NOTIFICATION =====
function showNotification(message, isError = false) {
    const notification = document.createElement('div');
    notification.textContent = message;

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${isError ? '#dc3545' : '#28a745'};
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        z-index: 1000;
    `;

    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 2500);
}

// ===== INIT =====
window.addEventListener('load', () => {
    checkPixelStatus();
});