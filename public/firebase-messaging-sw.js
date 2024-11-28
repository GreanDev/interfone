// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyBtX6I_Psw-Fi3FMxuYkyBCo5Ew_sfiTOw",

  authDomain: "interfone-1fcbb.firebaseapp.com",

  projectId: "interfone-1fcbb",

  storageBucket: "interfone-1fcbb.firebasestorage.app",

  messagingSenderId: "56758033116",

  appId: "1:56758033116:web:fc00136483829ce89df219",

  measurementId: "G-24MZG0GRPV",
};

console.log("Starting background worker");

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);

  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
