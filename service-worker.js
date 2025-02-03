self.addEventListener('install', event => {
        self.skipWaiting();
    });
    
    self.addEventListener('activate', event => {
        return self.clients.claim();
    });
    
    self.addEventListener('periodicsync', event => {
        if (event.tag === 'show-life-days') {
            event.waitUntil(showNotification());
        }
    });
    
    async function showNotification() {
        const birthdate = await getBirthdate();
        if (birthdate) {
            const days = calculateDays(birthdate);
            self.registration.showNotification('Life Days Reminder', {
                body: `Don't be a shit, you have lived ${days} days in this world!`,
                icon: 'icons/icon-192.png'
            });
        }
    }
    
    async function getBirthdate() {
        const clients = await self.clients.matchAll();
        if (clients.length > 0) {
            const client = clients[0];
            return client.storage.getItem('birthdate');
        }
        return null;
    }
    
    function calculateDays(birthdate) {
        const birth = new Date(birthdate);
        const today = new Date();
        const diffTime = Math.abs(today - birth);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }