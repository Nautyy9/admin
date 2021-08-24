import React, { useEffect, useState } from "react";
import { firebase } from "../initFirebase"
import { useLocation, useHistory } from 'react-router-dom'
import Loader from "../utils/Loader";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null);
  const [pending, setPending] = useState(true);
  const db = firebase.firestore()
  // let location = useLocation()
  // let history = useHistory()

  useEffect(() => {
      console.log('in the context')
      let callback = null;
      let metadataRef = null;
      firebase.auth().onAuthStateChanged((user) => {
        if(user){
          const doc = db.collection('users').doc(user.uid).get()
          if(doc.exists){
            setRole(doc.data().role)
          } 
        }
        setPending(false)
        setCurrentUser(user)
        
        console.log('Checking User',user)
        // history.push(location.pathname)
      });
  }, []);

  useEffect(async ()=>{
    if(currentUser){
      const doc = await db.collection('users').doc(currentUser.uid).get()
      if(doc.exists){
        setRole(doc.data().role)
      }
    }
  },[currentUser])

  if(pending){
    return (
        <>
            <Loader/>
        </>
    )
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};