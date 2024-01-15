import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import Axios from "axios";
import { getFirestore, collection, addDoc, deleteDoc, doc, getDocs, setDoc  } from "firebase/firestore";
import { Box, Typography } from "@mui/material";
import { useEffect, useReducer, useState } from "react";

var users = [];
const messages = [
];
let regDoc = "";
let currentKey = "";
//FCM
//https://firebase.google.com/docs/web/setup#config-object
const firebaseApp = initializeApp({
  apiKey: "AIzaSyD0En-gHoNBS0-slWk9dJaht3qS0ZLfbpw",

  authDomain: "interfone-gba.firebaseapp.com",

  projectId: "interfone-gba",

  storageBucket: "interfone-gba.appspot.com",

  messagingSenderId: "738904683689",

  appId: "1:738904683689:web:e1c93c75ba42a23e4ea5b8"


});


// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = getMessaging(firebaseApp);


getToken(messaging, { vapidKey: 'BM14V1QaG5wCT9bAZXmM8JHiYdUmA2C8Cu8CZxECQe1JYMvFOYsRfv066IaAfqI7CvEjWfZw2R0No-lG1VbJvIs' }).then((currentToken) => {
  if (currentToken) {
    // Send the token to your server and update the UI if necessary
    addKey(currentToken);
    currentKey = currentToken;
    // ...
  } else {
    // Show permission request UI
    console.log('No registration token available. Request permission to generate one.');
    // ...
  }
}).catch((err) => {
  console.log('An error occurred while retrieving token. ', err);
  // ...
});
  // ...

//Cloud Firestore
const db = getFirestore(firebaseApp);
async function addKey(key){
try {
   await setDoc(doc(db, "users", key), { null: 'null'});
    console.log("Document written with ID: ", key);
    regDoc = key;
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

onMessage(messaging, (payload) => {
  console.log('Message received. ', payload);
  const notification = new Notification(payload.data.title, {
    body: payload.data.body
  });
  
  console.log("Adding to texts");
  var msgText = <Typography variant="h6" sx={{bgcolor: 'primary.main', margin: '5px', borderRadius: '5px', paddingLeft:'8px', color: 'black' }}>
  {payload.data.body}
</Typography>
  messages.push(msgText);    // ...
  
});

function Messages(){
  const [time, setTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
    return(
    messages
  );
}
async function getUsers(){
  users = [];
const querySnapshot = await getDocs(collection(db, "users"));
querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  console.log(doc.id, " => ", doc.id);
  if (doc.id != regDoc) {
  users.push(doc.id);
  console.log("Added: "+ doc.id+" To users list");
  }
});
}

async function sendMessage(message){
  if (message === ""){return;} 
  await getUsers();
  users.forEach((usr) =>{
    if (usr == currentKey) {return;}
    console.log("Sending to: "+usr);
  const config = {
    headers: { Authorization: `key=AAAArAomtKk:APA91bGY04nT8NQmzC3tqcaU0-0ZaMBRRWrVY2ROooEOSMseWTka_F3Z43a9JTjzybV6gwUa0WT5EOJ5oOsss6wWxJQVvVQxYJAOJ9R0OfDxDze4j52e2n_90v5RHT5dRyu0dlgIG2is` }
  };
  const body = {
       "to":usr,
       "data":{
         "body": message,
         "title":"InterFone Message"
    }
 };

 Axios.post(
  'https://fcm.googleapis.com/fcm/send',
  body,
  config
 
 )
 
  

  })
  console.log("Adding to texts");
  var msgText = <Typography variant="h6" sx={{bgcolor: 'secondary.main', margin: '5px', borderRadius: '5px', paddingLeft:'8px', color: 'black' }}>
  {message}
</Typography>
  messages.push(msgText); 
  var scroll=document.getElementById("msgsBox");
  scroll.scrollTop = scroll.scrollHeight;

}

async function logoff(){
    console.log("Logging off..."+regDoc);
    await deleteDoc(doc(db, "users", regDoc));
}

export { logoff , sendMessage, Messages };