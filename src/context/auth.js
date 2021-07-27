import React, { useEffect, useState } from "react";
import { firebase } from "../initFirebase"
import Loader from "../utils/Loader";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null);
  const [pending, setPending] = useState(true);

  useEffect(() => {
      console.log('in the context')
      let callback = null;
      let metadataRef = null;
      firebase.auth().onAuthStateChanged((user) => {
        setCurrentUser(user)
        setPending(false)
        console.log('Checking User',user)
        if (callback) {
            metadataRef.off('value', callback);
          }
          // On user login add new listener.
          if (user) {
            // Check if refresh is required.
            metadataRef = firebase.database().ref('metadata/' + user.uid + '/refreshTime');
            callback = (snapshot) => {
              // Force refresh to pick up the latest custom claims changes.
              // Note this is always triggered on first call. Further optimization could be
              // added to avoid the initial trigger when the token is issued and already contains
              // the latest claims.
              console.log('snapshot',snapshot)
              user.getIdToken(true);
            };
            // Subscribe new listener to changes on that node.
            metadataRef.on('value', callback);
          }
      });
  }, []);

  useEffect(()=>{
    if(currentUser){
      firebase.auth().currentUser.getIdTokenResult()
      .then((idTokenResult) => {
        // Confirm the user is an Admin.
        if (!!idTokenResult.claims.role) {
          // Show admin UI.
          setRole('admin')
          console.log("claims",idTokenResult.claims)
        } else {
          // Show regular user UI.
          setRole('superuser')
          console.log('superuser')
        }
      })
      .catch((error) => {
        console.log(error);
      });
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