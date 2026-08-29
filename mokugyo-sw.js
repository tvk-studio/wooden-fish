const CACHE = 'mokugyo-v1';
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.add(self.registration.scope)));
  self.skipWaiting();
});
self.addEventListener('activate', (e) => { self.clients.claim(); });
self.addEventListener('periodicsync', (e) => {
  if (e.tag === 'mokugyo-daily-reminder') {
    e.waitUntil(self.registration.showNotification('功德木鱼 · 敲木鱼时间到了', {
      body: '今天还没敲木鱼，来累积一点功德吧 🐟',
      icon: 'mokugyo-icon-192.png',
      badge: 'mokugyo-icon-192.png',
      tag: 'mokugyo-daily-reminder'
    }));
  }
});
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(self.registration.scope);
    })
  );
});
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return res;
      }).catch(() => cached);
    })
  );
});
