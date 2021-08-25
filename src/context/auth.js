import React, { useEffect, useState } from "react";
import { firebase } from "../initFirebase"
import Loader from "../utils/Loader";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null);
  const [pending, setPending] = useState(true);
  const db = firebase.firestore()

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
          setCurrentUser(user)
        }
        else{
          setCurrentUser(null)
        }
        setPending(false)
        
        
        console.log('Checking User',user)
      });
  }, []);

  useEffect(()=>{
    if(currentUser){
      const doc = db.collection('users').doc(currentUser.uid).get()
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