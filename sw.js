// Service Worker - Namaz Vakti Bildirimi
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

// Bildirim tıklanınca uygulamayı aç
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow('/'));
});

// Alarm mesajı gelince
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SCHEDULE_PRAYER') {
    const { prayers, ezanNum, notifOn } = e.data;
    schedulePrayers(prayers, ezanNum, notifOn);
  }
});

const timers = [];

function schedulePrayers(prayers, ezanNum, notifOn) {
  timers.forEach(t => clearTimeout(t));
  timers.length = 0;

  const now = Date.now();

  prayers.forEach(p => {
    const diff = p.time - now;
    const diff20 = p.time - now - 20 * 60 * 1000;

    // 20 dk önce bildirim
    if (diff20 > 0 && notifOn) {
      timers.push(setTimeout(() => {
        self.registration.showNotification(`⏰ ${p.name}`, {
          body: `${p.name} vakti 20 dakika sonra - ${p.timeStr}`,
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          vibrate: [200, 100, 200],
          tag: `prayer-before-${p.key}`
        });
      }, diff20));
    }

    // Tam vakitte bildirim
    if (diff > 0 && diff < 24 * 60 * 60 * 1000) {
      timers.push(setTimeout(() => {
        if (notifOn) {
          self.registration.showNotification(`🕌 ${p.name} Vakti`, {
            body: `${p.name} namazı vakti geldi - ${p.timeStr}`,
            icon: '/icon-192.png',
            badge: '/icon-192.png',
            vibrate: [300, 100, 300, 100, 300],
            tag: `prayer-${p.key}`,
            renotify: true
          });
        }
      }, diff));
    }
  });
}
