import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA425iAT8ZdS4AnD38_E2ZCr_25p2341s",
  authDomain: "paslytics-80711756-8913a.firebaseapp.com",
  projectId: "paslytics-80711756-8913a",
  storageBucket: "paslytics-80711756-8913a.appspot.com",
  messagingSenderId: "578036239556",
  appId: "1:578036239556:web:866e4a23a3d8f1659a58b4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
