let swRegistration = null;
let notificationInterval = null;

// Check if service workers are supported
if ('serviceWorker' in navigator && 'Notification' in window) {
    window.addEventListener('load', async () => {
        try {
            swRegistration = await navigator.serviceWorker.register('service-worker.js');
            console.log('ServiceWorker registered');
            initializeApp();
        } catch (err) {
            console.error('ServiceWorker registration failed: ', err);
            updateDebugInfo('ServiceWorker registration failed: ' + err.message);
        }
    });
}

async function initializeApp() {
    const birthdate = localStorage.getItem('birthdate');
    if (birthdate) {
        document.getElementById('birthdate').value = birthdate;
        showDaysLived();
        if (Notification.permission === 'granted') {
            startNotificationTimer();
        }
    }
}

document.getElementById('saveButton').addEventListener('click', async () => {
    const birthdate = document.getElementById('birthdate').value;
    
    if (!birthdate) {
        alert('Please enter your birth date');
        return;
    }

    try {
        if (Notification.permission !== 'granted') {
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                alert('Please allow notifications to use this app');
                return;
            }
        }

        localStorage.setItem('birthdate', birthdate);
        showDaysLived();
        startNotificationTimer();
        
        document.getElementById('status').textContent = 'Birth date saved! Notifications enabled.';
        updateDebugInfo('Settings saved successfully');
    } catch (error) {
        console.error('Error saving settings:', error);
        updateDebugInfo('Error saving settings: ' + error.message);
    }
});

function showDaysLived() {
    const birthdate = localStorage.getItem('birthdate');
    if (birthdate) {
        const days = calculateDays(birthdate);
        document.getElementById('daysCount').textContent = 
            `You have lived ${days} days in this world!`;
    }
}

function calculateDays(birthdate) {
    const birth = new Date(birthdate);
    const today = new Date();
    const diffTime = Math.abs(today - birth);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function showNotification() {
    const birthdate = localStorage.getItem('birthdate');
    if (birthdate && swRegistration && Notification.permission === 'granted') {
        const days = calculateDays(birthdate);
        swRegistration.showNotification('Life Days Reminder', {
            body: `Don't be a shit, you have lived ${days} days in this world!`,
            icon: 'icons/icon-192.png',
            badge: 'icons/icon-192.png',
            vibrate: [200, 100, 200]
        });
    }
}

function startNotificationTimer() {
    // Clear existing interval if any
    if (notificationInterval) {
        clearInterval(notificationInterval);
    }

    // Show first notification immediately
    showNotification();
    
    // Set up interval for every 10 minutes
    notificationInterval = setInterval(() => {
        showNotification();
    }, 10 * 60 * 1000); // 10 minutes
}

// Handle visibility change
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        updateDebugInfo('Page is hidden, notifications might be restricted');
    } else {
        updateDebugInfo('Page is visible, notifications will work');
        showNotification();
    }
});

// Wake Lock API
async function requestWakeLock() {
    if ('wakeLock' in navigator) {
        try {
            const wakeLock = await navigator.wakeLock.request('screen');
            updateDebugInfo('Wake Lock is active');
        } catch (err) {
            updateDebugInfo(`Wake Lock error: ${err.name}, ${err.message}`);
        }
    }
}

// Debug functions
function checkNotificationStatus() {
    const debugInfo = {
        notificationPermission: Notification.permission,
        serviceWorkerRegistered: !!swRegistration,
        birthdate: localStorage.getItem('birthdate'),
        notificationInterval: !!notificationInterval,
        pageVisibility: document.hidden ? 'hidden' : 'visible'
    };
    
    updateDebugInfo(JSON.stringify(debugInfo, null, 2));
}

function updateDebugInfo(info) {
    const debugInfo = document.getElementById('debugInfo');
    debugInfo.textContent = typeof info === 'string' ? info : JSON.stringify(info, null, 2);
}

// Debug button
document.getElementById('debugButton').addEventListener('click', checkNotificationStatus);

// Initialize debug section in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    document.querySelector('.debug-section').style.display = 'block';
}