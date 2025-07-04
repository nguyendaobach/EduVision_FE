// src/utils/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCXvxPo7IhiWrJ2wIEZO8u-bVYhv8-_rmA",
  authDomain: "eduvision-7d79b.firebaseapp.com",
  projectId: "eduvision-7d79b",
  storageBucket: "eduvision-7d79b.appspot.com",
  messagingSenderId: "859564462424",
  appId: "1:859564462424:web:961e9e2cf62567e8c1d52d",
  measurementId: "G-0TVY392QN7",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const getFcmToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return null;
    const token = await getToken(messaging, {
      vapidKey:
        "BFGAKHarGR4K36qci9LD5nEUe4RUKrEKiyl6EUF5fWf2g6n6jwTYUh0WTiM0tL6Og8OmfoErnk5lBz1jpGjhooo",
    });
    return token;
  } catch (err) {
    console.error("FCM Error:", err);
    return null;
  }
};

export const listenFcmMessage = (callback) => {
  onMessage(messaging, callback);
};
