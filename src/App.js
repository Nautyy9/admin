import React, { useEffect } from 'react';
import {
  Switch,
  Route,
  useLocation
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

function App() {

  const location = useLocation();

  console.log(firebase.auth().currentUser)

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
          <PrivateRoute path="/shelves" component={Shelves} type="private"/>
          <PrivateRoute path="/entryexit" component={EntryAndExit} type="private"/>
        </Switch>
      </AuthProvider>
    </>
  );
}

export default App;
