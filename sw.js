importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAcayaTwgVdyGQJpMvvHF3AX7FXTEvFopY",
  authDomain: "mensageiro-mtz.firebaseapp.com",
  projectId: "mensageiro-mtz",
  storageBucket: "mensageiro-mtz.firebasestorage.app",
  messagingSenderId: "111747514886",
  appId: "1:111747514886:web:d87c69893640606efab987"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const notificationTitle = payload.notification?.title || payload.data?.title || 'Novo Alerta';
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.descricao || 'Verifique o sistema.',
    icon: 'https://cdn-icons-png.flaticon.com/512/5968/5968771.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

const CACHE_NAME = 'mtz-mensageiro-v1';
const ASSETS = [
  './login.html',
  './index.html',
  './chat.html',
  './admin.html',
  './cadastro.html',
  './manifest.json'
];

// Instalação do Service Worker e Armazenamento do Layout no Cache
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Ativação e limpeza de caches antigos
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Intercepta as requisições (Stale-while-revalidate)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      const fetchPromise = fetch(e.request).then((networkResponse) => {
        if (e.request.method === 'GET') {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, networkResponse.clone());
          });
        }
        return networkResponse;
      }).catch(() => {
        // Ignora erro se estiver offline
      });
      return cachedResponse || fetchPromise;
    })
  );
});