// ===== CONVERSIONS API CONFIG =====
const CONVERSIONS_API_CONFIG = {
    pixelId: '1910039766318558',
    accessToken: 'EAAYrkSzu0xMBRVbZB8XZCnuJl4IZAmwtUkqWdJnILpqAs7ARdVnoL3ZCsDMq0IUua6CXcKXfjLqfBc17GsabBZB8W7OQb8j6lIkMZCAzCxkLZBcrcVXq2ZCGVwzjRjBNDZCzqA86sgWWjs7XP6xOe52Xbe0D3CZABYi8f8mD8zZBAthkgC2NS7kT4V2vilsTCD6pAZDZD',
    apiVersion: 'v21.0',
    endpoint: 'https://graph.facebook.com/v21.0/1910039766318558/events'
};

// ===== CHECK PIXEL STATUS =====
function checkPixelStatus() {
    const statusElement = document.getElementById('pixel-status');

    setTimeout(() => {
        if (typeof fbq !== 'undefined') {
            statusElement.innerHTML = '<span class="connected">✓ Meta Pixel Connected</span><br><small>Conversions API Ready</small>';
            console.log('✓ Meta Pixel is loaded');
            console.log('✓ Conversions API configured');
        } else {
            statusElement.innerHTML = '<span class="error">✗ Meta Pixel Not Loaded</span>';
            console.error('✗ Meta Pixel failed to load');
        }
    }, 1000);
}

// ===== SEND TO CONVERSIONS API =====
async function sendToConversionsAPI(eventName, eventData) {
    const eventTime = Math.floor(Date.now() / 1000);
    
    // Hash email for user_data (example with test email)
    const testEmail = 'test@example.com';
    const hashedEmail = await hashSHA256(testEmail);
    
    const payload = {
        data: [{
            event_name: eventName,
            event_time: eventTime,
            action_source: 'website',
            event_source_url: window.location.href,
            user_data: {
                em: [hashedEmail],
                client_ip_address: '', // Will be filled by server
                client_user_agent: navigator.userAgent
            },
            custom_data: eventData || {}
        }]
    };

    try {
        const response = await fetch(`${CONVERSIONS_API_CONFIG.endpoint}?access_token=${CONVERSIONS_API_CONFIG.accessToken}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        
        if (response.ok) {
            console.log('✓ Conversions API event sent:', eventName, result);
            return true;
        } else {
            console.error('✗ Conversions API error:', result);
            return false;
        }
    } catch (error) {
        console.error('✗ Conversions API request failed:', error);
        return false;
    }
}

// ===== HASH FUNCTION FOR USER DATA =====
async function hashSHA256(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text.toLowerCase().trim());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ===== TRACK EVENTS (WITH CONVERSIONS API) =====
async function trackEvent(eventName) {
    if (typeof fbq === 'undefined') {
        console.error('❌ Pixel not loaded');
        showNotification('Pixel not loaded', true);
        return;
    }

    let eventData = {};

    switch (eventName) {
        case 'ViewContent':
            eventData = {
                content_name: 'Test Product',
                content_category: 'Test Category',
                value: 10.0,
                currency: 'USD'
            };
            fbq('track', 'ViewContent', eventData);
            break;

        case 'AddToCart':
            eventData = {
                content_name: 'Test Product',
                content_ids: ['123'],
                content_type: 'product',
                value: 10.0,
                currency: 'USD'
            };
            fbq('track', 'AddToCart', eventData);
            break;

        case 'Purchase':
            eventData = {
                value: 142.52,
                currency: 'USD'
            };
            fbq('track', 'Purchase', eventData);
            break;

        default:
            fbq('trackCustom', eventName);
    }

    console.log(`✓ Browser Pixel event tracked: ${eventName}`);
    
    // Send to Conversions API
    const apiSuccess = await sendToConversionsAPI(eventName, eventData);
    
    if (apiSuccess) {
        showNotification(`${eventName} sent (Browser + API)`);
    } else {
        showNotification(`${eventName} sent (Browser only)`, true);
    }
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