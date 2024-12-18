import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import Axios from "axios";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import {
  connectFunctionsEmulator,
  getFunctions,
  httpsCallable,
} from "firebase/functions";
import { Box, Typography } from "@mui/material";
import { useEffect, useReducer, useState } from "react";

var users = [];
const messages = [];
const selfMessages = [];
let regDoc = "";
let currentKey = "";
//FCM
//https://firebase.google.com/docs/web/setup#config-object
const cfg = {
  apiKey: "AIzaSyBtX6I_Psw-Fi3FMxuYkyBCo5Ew_sfiTOw",

  authDomain: "interfone-1fcbb.firebaseapp.com",

  projectId: "interfone-1fcbb",

  storageBucket: "interfone-1fcbb.firebasestorage.app",

  messagingSenderId: "56758033116",

  appId: "1:56758033116:web:fc00136483829ce89df219",

  measurementId: "G-24MZG0GRPV",
};
const firebaseApp = initializeApp(cfg);
const functions = getFunctions(firebaseApp, "us-central1");
// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = getMessaging(firebaseApp);
//Don't uncomment this dipshit
//connectFunctionsEmulator(functions, "localhost", 5001);
const subscribeMe = httpsCallable(functions, "subscribeMe");
subscribeMe().then((result) => {
  console.log(result);
});

getToken(messaging, { vapidKey: cfg.PublicKey })
  .then((currentToken) => {
    if (currentToken) {
      // Send the token to your server and update the UI if necessary
      addKey(currentToken);
      currentKey = currentToken;
      // ...
    } else {
      // Show permission request UI
      console.log(
        "No registration token available. Request permission to generate one.",
      );
      // ...
    }
  })
  .catch((err) => {
    console.log("An error occurred while retrieving token. ", err);
    // ...
  });
// ...

//Cloud Firestore
const db = getFirestore(firebaseApp);
async function addKey(key) {
  try {
    await setDoc(doc(db, "users", key), { null: "null" });
    console.log("Document written with ID: ", key);
    regDoc = key;
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

onMessage(messaging, (payload) => {
  console.log("Message received. ", payload);
  // const notification = new Notification(payload.data.title, {
  //   body: payload.data.body
  // });

  console.log("Adding to texts");
  var msgText = (
    <Typography
      variant="h6"
      sx={{
        bgcolor: "primary.main",
        margin: "5px",
        borderRadius: "5px",
        padding: "0",
        paddingLeft: "5px",
        paddingRight: "5px",
        margin: "0",
        marginTop: "5px",
        color: "black",
      }}
    >
      {payload.data.body}
    </Typography>
  );
  var otherPad = (
    <Typography
      variant="h6"
      sx={{
        opacity: "0",
        bgcolor: "primary.main",
        margin: "5px",
        borderRadius: "5px",
        padding: "0",
        paddingLeft: "5px",
        paddingRight: "5px",
        margin: "0",
        marginTop: "5px",
        color: "black",
      }}
    >
      {payload.data.body}
    </Typography>
  );
  messages.push(msgText);
  selfMessages.push(otherPad);
  var scroll = document.getElementById("msgsBox");
  scroll.scrollTop = scroll.scrollHeight; // ...

  var scroll = document.getElementById("msgsBox");
  scroll.scrollTop = scroll.scrollHeight;
});

function Messages() {
  const [time, setTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return messages;
}

function SelfMessages() {
  const [time, setTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return selfMessages;
}

async function sendMessage(message) {
  if (message === "") {
    return;
  }
  const msgdb = getFirestore(firebaseApp);
  console.log(typeof msgdb);
  await addDoc(collection(msgdb, "messages"), {
    content: message,
    user: "main",
  });

  console.log("Adding to texts");
  var msgText = (
    <Typography
      variant="h6"
      sx={{
        bgcolor: "secondary.main",
        margin: "5px",
        borderRadius: "5px",
        padding: "0",
        paddingLeft: "5px",
        paddingRight: "5px",
        margin: "0",
        marginTop: "5px",
        color: "black",
      }}
    >
      {message}
    </Typography>
  );
  var otherPad = (
    <Typography
      variant="h6"
      sx={{
        opacity: "0",
        bgcolor: "secondary.main",
        margin: "5px",
        borderRadius: "5px",
        padding: "0",
        paddingLeft: "5px",
        paddingRight: "5px",
        margin: "0",
        marginTop: "5px",
        color: "black",
      }}
    >
      {message}
    </Typography>
  );
  selfMessages.push(msgText);
  messages.push(otherPad);
  var scroll = document.getElementById("msgsBox");
  scroll.scrollTop = scroll.scrollHeight;
}

async function logoff() {
  console.log("Logging off..." + regDoc);
  await deleteDoc(doc(db, "users", regDoc));
}

export { logoff, sendMessage, Messages, SelfMessages };
