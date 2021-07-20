import React, { useEffect } from 'react';
import {
  Switch,
  Route,
  useLocation
} from 'react-router-dom';
import { firebase } from "./initFirebase";
import './css/style.scss';

import { focusHandling } from 'cruip-js-toolkit';
import './charts/ChartjsConfig';

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
      <Switch>
        <Route exact path="/" component={Login}/>
        <Route path="/customers" component={Customer}/>
        <Route path="/shelves" component={Shelves}/>
        <Route path="/entryexit" component={EntryAndExit}/>
      </Switch>
    </>
  );
}

export default App;
