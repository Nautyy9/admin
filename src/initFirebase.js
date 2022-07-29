import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD3KDLb7tNgxyudTHdgxzC-Pk0dsWNK6yQ",
  authDomain: "admin-dashboard-1e2ed.firebaseapp.com",
  projectId: "admin-dashboard-1e2ed",
  storageBucket: "admin-dashboard-1e2ed.appspot.com",
  messagingSenderId: "1059586277528",
  appId: "1:1059586277528:web:7df44ac7fa8a22e84510ed"
};


firebase.initializeApp(firebaseConfig)
const secondaryFirebase = firebase.initializeApp(firebaseConfig, "Secondary")

export { firebase, secondaryFirebase }


