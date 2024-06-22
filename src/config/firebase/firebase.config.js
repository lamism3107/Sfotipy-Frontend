import { getApp, getApps, initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// require("dotenv/config");
const firebaseConfig = {
  // apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  // authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  // projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  // storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  // messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_ID,
  // appId: process.env.REACT_APP_FIREBASE_APP_ID,
  // measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,

  apiKey: "AIzaSyCwaYagM4CA4_wmeYmV4Q5BvtxT6X4AnWY",
  authDomain: "spotify-clone-350f3.firebaseapp.com",
  projectId: "spotify-clone-350f3",
  storageBucket: "spotify-clone-350f3.appspot.com",
  messagingSenderId: "79605332986",
  appId: "1:79605332986:web:b420b21e42cda7853e0243",
  measurementId: "G-N3BJ01CKWD",
};

const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);
const storage = getStorage(app);

export { app, storage };
