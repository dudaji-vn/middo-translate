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
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload,
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: './logo.png',
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
