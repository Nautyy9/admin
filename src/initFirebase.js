import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import  "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDp-KZ6mW40EPpy48kYqg2mcxjL8olzi7E",
  authDomain: "dashboard-57331.firebaseapp.com",
  projectId: "dashboard-57331",
  storageBucket: "dashboard-57331.appspot.com",
  messagingSenderId: "978966435775",
  appId: "1:978966435775:web:c5890ce905495f4894330a"
};

// firebase().firestore().settings({
//   experimentalForceLongPolling: true, // this line
//   useFetchStreams: false, // and this line
// })

firebase.initializeApp(firebaseConfig)
const secondaryFirebase = firebase.initializeApp(firebaseConfig, "Secondary")

export { firebase, secondaryFirebase }


