self.addEventListener('push', function (event) {
  if (event.data) {
    const data = event.data.json();

    const options = {
      body: data.body,
      icon: '/favicon.ico',
      vibrate: [200, 100, 200],
      data: data.url || '/takiplerim'
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  // Bildirime tıklandığında yönlendirilecek sayfa
  const urlToOpen = event.notification.data;
  event.waitUntil(clients.openWindow(urlToOpen));
});