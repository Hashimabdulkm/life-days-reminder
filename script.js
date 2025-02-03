let swRegistration = null;

// Check if service workers are supported
if ('serviceWorker' in navigator && 'Notification' in window) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/life-days-reminder/service-worker.js')
            .then(registration => {
                swRegistration = registration;
                console.log('ServiceWorker registered');
            })
            .catch(err => console.log('ServiceWorker registration failed: ', err));
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const birthdateInput = document.getElementById('birthdate');
    const saveButton = document.getElementById('saveButton');
    const statusElement = document.getElementById('status');
    const daysCountElement = document.getElementById('daysCount');

    saveButton.addEventListener('click', async () => {
        if (!birthdateInput.value) {
            alert('Please enter your birth date');
            return;
        }

        // Request notification permission
        if (Notification.permission !== 'granted') {
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                statusElement.textContent = 'Notifications denied';
                return;
            }
        }

        localStorage.setItem('birthdate', birthdateInput.value);
        updateDaysCount();
        statusElement.textContent = 'Settings saved!';
    });

    function updateDaysCount() {
        const birthdate = localStorage.getItem('birthdate');
        if (birthdate) {
            const days = Math.floor((new Date() - new Date(birthdate)) / (1000 * 60 * 60 * 24));
            daysCountElement.textContent = `You've been alive for ${days} days!`;
        }
    }

    // Load saved birthdate
    const savedBirthdate = localStorage.getItem('birthdate');
    if (savedBirthdate) {
        birthdateInput.value = savedBirthdate;
        updateDaysCount();
    }
});