 // Scripts for firebase and firebase messaging
 importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
 importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

 // Initialize the Firebase app in the service worker by passing the generated config
 const firebaseConfig = {

  apiKey: "AIzaSyD0En-gHoNBS0-slWk9dJaht3qS0ZLfbpw",

  authDomain: "interfone-gba.firebaseapp.com",

  projectId: "interfone-gba",

  storageBucket: "interfone-gba.appspot.com",

  messagingSenderId: "738904683689",

  appId: "1:738904683689:web:e1c93c75ba42a23e4ea5b8"

};

console.log('Starting background worker');

 firebase.initializeApp(firebaseConfig);

 // Retrieve firebase messaging
 const messaging = firebase.messaging();

 messaging.onBackgroundMessage(function(payload) {
   console.log("Received background message ", payload);

   const notificationTitle = payload.data.title;
   const notificationOptions = {
     body: payload.data.body,
   };

   self.registration.showNotification(notificationTitle, notificationOptions);
 });