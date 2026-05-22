// Service Worker - Namaz Vakti Bildirimi
// Profesyonel: Tek timer + her dakika kontrol sistemi

self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow('./'));
});

let prayerData = null;
let checkInterval = null;
let lastNotified = {};

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SCHEDULE_PRAYER') {
    prayerData = e.data;
    startChecking();
  }
});

function startChecking() {
  if (checkInterval) clearInterval(checkInterval);
  // Her 30 saniyede bir kontrol et - timer'a güvenme
  checkInterval = setInterval(checkPrayerTimes, 30000);
  checkPrayerTimes(); // Hemen bir kontrol
}

function checkPrayerTimes() {
  if (!prayerData) return;
  const { prayers, notifOn } = prayerData;
  const now = new Date();
  const nowTime = now.getHours() * 60 + now.getMinutes();
  const today = now.toDateString();

  prayers.forEach(p => {
    const [h, m] = p.timeStr.split(':').map(Number);
    const prayerMin = h * 60 + m;
    const diff = prayerMin - nowTime;
    const notifKey = `${today}-${p.key}`;
    const notifKey20 = `${today}-${p.key}-20`;

    // 20 dk önce bildirim (19-21 dk arası kabul et)
    if (diff >= 19 && diff <= 21 && !lastNotified[notifKey20] && notifOn) {
      lastNotified[notifKey20] = true;
      self.registration.showNotification(`⏰ ${p.name}`, {
        body: `${p.name} vakti 20 dakika sonra - ${p.timeStr}`,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        vibrate: [200, 100, 200],
        tag: `before-${p.key}`,
        renotify: true
      });
    }

    // Tam vakit (0-2 dk arası kabul et - 30sn kontrol için)
    if (diff >= 0 && diff <= 1 && !lastNotified[notifKey]) {
      lastNotified[notifKey] = true;
      if (notifOn) {
        self.registration.showNotification(`🕌 ${p.name} Vakti`, {
          body: `${p.name} namazı vakti geldi - ${p.timeStr}`,
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          vibrate: [300, 100, 300, 100, 300],
          tag: `prayer-${p.key}`,
          renotify: true,
          requireInteraction: true
        });
      }
      // Uygulamaya mesaj gönder - ezan çalsın
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'PLAY_EZAN',
            prayer: p.name
          });
        });
      });
    }
  });

  // Gece yarısı lastNotified temizle
  if (now.getHours() === 0 && now.getMinutes() === 0) {
    lastNotified = {};
  }
}
