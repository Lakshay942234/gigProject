self.addEventListener("install", (event) => {
  console.log("Service Worker installing.");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activating.");
  event.waitUntil(clients.claim());
});

self.addEventListener("push", function (event) {
  console.log("Push event received", event);
  if (event.data) {
    const data = event.data.json();
    console.log("Push data:", data);

    const options = {
      body: data.body,
      icon: "/logo.png", // Use existing logo
      badge: "/vite.svg", // Use existing svg as badge (might need png but let's try)
      data: {
        url: data.url,
      },
      requireInteraction: true,
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
  } else {
    console.log("Push event but no data");
  }
});

self.addEventListener("notificationclick", function (event) {
  console.log("Notification clicked", event);
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((windowClients) => {
      // Check if there is already a window for this URL
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === event.notification.data.url && "focus" in client) {
          return client.focus();
        }
      }
      // If not, open a new window
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});
