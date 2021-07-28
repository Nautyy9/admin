import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyA3T-3p0m-GV7a2vgdNNcLSmHjN_5Y8yGI",
    authDomain: "deerika-smart-store-rdb.firebaseapp.com",
    databaseURL: "https://deerika-smart-store-rdb-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "deerika-smart-store-rdb",
    storageBucket: "deerika-smart-store-rdb.appspot.com",
    messagingSenderId: "157472897205",
    appId: "1:157472897205:web:18fc50ce3c1609a44fe6fc"
};


firebase.initializeApp(firebaseConfig)

const secondaryFirebase = firebase.initializeApp(firebaseConfig,"Secondary")

export { firebase,secondaryFirebase }
