import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFwF4kN4LCNf5y2JLvaW9P5l9WKMk0noY",
  authDomain: "paslytics-80711756-8913a.firebaseapp.com",
  projectId: "paslytics-80711756-8913a",
  storageBucket: "paslytics-80711756-8913a.firebasestorage.app",
  messagingSenderId: "278824874614",
  appId: "1:278824874614:web:8ecfe8587c0ad72f2ae557"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
