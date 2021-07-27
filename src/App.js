import React, { useEffect, useState } from 'react';
import {
  Switch,
  Route,
  useLocation,
  Link
} from 'react-router-dom';
import { firebase } from "./initFirebase";
import PrivateRoute from './utils/PrivateRoute';
import './css/style.scss';

import { focusHandling } from 'cruip-js-toolkit';
import './charts/ChartjsConfig';
import { AuthProvider } from './context/auth';

// Import pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Customer from './pages/Customer';
import Shelves from './pages/Shelves';
import EntryAndExit from './pages/EntryAndExit';
import Team from './pages/Team';

const PageNotFound = () => {
  return(
    <>
      <div className="m-4 font-bold">
        <h1 className="text-3xl mb-6">
          Page Not Found
        </h1>
        <Link className="text-indigo-600" to='/'>Go to Home</Link>
      </div>
    </>
  )
}

function App() {
  const [role, setRole] = useState(null)
  const location = useLocation();

  console.log(firebase.auth().currentUser)

  useEffect(()=>{
    if(firebase.auth().currentUser){
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
  },[])

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
    focusHandling('outline');
  }, [location.pathname]); // triggered on route change

  return (
    <>
      <AuthProvider>
        <Switch>
          <PrivateRoute exact path="/" component={Dashboard} type="private"/>
          <PrivateRoute path="/login" component={Login} type="guest"/>
          <PrivateRoute path="/customers" component={Customer} type="private"/>
          {/* {
            role==="admin" &&
            <> */}
            <PrivateRoute path="/shelves" component={Shelves} type="private"/>
            <PrivateRoute path="/entryexit" component={EntryAndExit} type="private"/>
            {/* </>
          } */}
          <PrivateRoute path="/team" component={Team} type="private"/>
          <Route component={PageNotFound}/>
        </Switch>
      </AuthProvider>
    </>
  );
}

export default App;
