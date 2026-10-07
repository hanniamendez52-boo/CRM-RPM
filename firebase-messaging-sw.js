importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyBGbROJ_ipONNi9-mjPnyCax0ulm6lI6ec',
  authDomain: 'crm-crpm.firebaseapp.com',
  projectId: 'crm-crpm',
  storageBucket: 'crm-crpm.firebasestorage.app',
  messagingSenderId: '1088600245470',
  appId: '1:1088600245470:web:7436d0601c949b57a12e4f'
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Push recibido en segundo plano:', payload);
  const title = payload.notification?.title || payload.data?.title || 'Campo360';
  const options = {
    body: payload.notification?.body || payload.data?.body || 'Nueva notificación de Campo360',
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect width="192" height="192" rx="36" fill="%2313543a"/><text x="96" y="120" font-size="90" font-family="system-ui,sans-serif" font-weight="bold" text-anchor="middle" fill="%2391e5af">360</text></svg>',
    badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><circle cx="96" cy="96" r="90" fill="%2313543a"/></svg>',
    data: payload.data
  };
  self.registration.showNotification(title, options);
});
