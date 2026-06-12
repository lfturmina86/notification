import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getMessaging } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging.js";

const firebaseConfig = {
    apiKey: "AIzaSyAcayaTwgVdyGQJpMvvHF3AX7FXTEvFopY",
    authDomain: "mensageiro-mtz.firebaseapp.com",
    projectId: "mensageiro-mtz",
    storageBucket: "mensageiro-mtz.firebasestorage.app",
    messagingSenderId: "111747514886",
    appId: "1:111747514886:web:d87c69893640606efab987"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const messaging = getMessaging(app);

const VAPID_KEY = "BD8nGTYbfnVzHUyIBm8xq0H7NMY7E3JCrrsW162skKAfo_c6Oo043AZ2xOrJLFI9W_WZQR3bQQuiwQAdZ385ihU";

const ADMIN_EMAILS = [
    "luis@matrezan.com.br"
];

export { app, auth, db, messaging, VAPID_KEY, ADMIN_EMAILS };
