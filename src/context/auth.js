import React, { useEffect, useState } from "react";
import { firebase } from "../initFirebase"
import Loader from "../utils/Loader";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null);
  const [store, setStore] = useState(null);
  const [email, setEmail] = useState(null);
  const [pending, setPending] = useState(true);
  const db = firebase.firestore()

  useEffect(() => {
      firebase.auth().onAuthStateChanged(async (user) => {
        if(user){
          const doc = await db.collection('users').doc(user.uid).get()
          if(doc.exists){
            setRole(doc.data().role)
            if(doc.data().store){
              setStore(doc.data().store)
            }
            if(doc.data().email){
              setEmail(doc.data().email)
            }
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
        if(doc.data().store){
          setStore(doc.data().store)
        }
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
        role,
        store,
        email
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};