// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-app.js');
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-messaging.js');

const firebaseConfig = {
  apiKey: 'AIzaSyCUn5KV-z1PTBMxwyVbtZLTRr4G9GdrMHs',
  authDomain: 'middo-translate.firebaseapp.com',
  projectId: 'middo-translate',
  storageBucket: 'middo-translate.appspot.com',
  messagingSenderId: '835558552712',
  appId: '1:835558552712:web:0523aadb556b9c26e41b3d',
  measurementId: 'G-2VL4NDQZRQ',
};
// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig);
// eslint-disable-next-line no-undef
const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: '/notify-logo.png',
    data: {
      url: payload.data.url,
    },
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
  self.addEventListener('notificationclick', (event) => {
    event.waitUntil(
      clients
        .matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
          for (let i = 0; i < clientList.length; i += 1) {
            const client = clientList[i];
            if ('focus' in client) {
              client.focus();
              client.postMessage({
                action: 'redirect-from-notificationclick',
                url: event.notification.data.url,
              });
              if (event.notification.data && event.notification.data.url) {
                return client.navigate(event.notification.data.url); // Navigate to the URL after focusing
              }
            }
          }
          if (
            clients.openWindow &&
            event.notification.data &&
            event.notification.data.url
          ) {
            return clients.openWindow(event.notification.data.url); // Open a new window if no existing window is found
          }
          return null;
        }),
    );
    event.notification.close();
  });
});
