import React, { useEffect, useContext } from 'react';
import {
  Switch,
  Route,
  useLocation,
  Link,
  Redirect
} from 'react-router-dom';
import { firebase } from "./initFirebase";
import PrivateRoute from './utils/PrivateRoute';
import './css/style.scss';

import { focusHandling } from 'cruip-js-toolkit';
import './charts/ChartjsConfig';
import { AuthContext } from './context/auth';
import Loader from './utils/Loader';

// Import pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Customer from './pages/Customer';
import Shelves from './pages/Shelves';
import EntryAndExit from './pages/EntryAndExit';
import Team from './pages/Team';
import AddProduct from './pages/AddProduct';

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
  const { currentUser, role } = useContext(AuthContext)
  const location = useLocation();


  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
    focusHandling('outline');
    // checkRole()
  }, [location.pathname]); // triggered on route change


  return (
    <>
      {
        !role ? 
          <Loader/>
        :
      <Switch>
        <PrivateRoute path="/login" component={Login} type="guest"/>
        { role === 'staff' ? 
          <>
            <PrivateRoute exact path="/" component={AddProduct} type="private" staff={true}/>
            <Redirect to="/"/>
          </>
        :

        <>
          <PrivateRoute exact path="/" component={Dashboard} type="private"/>
          <PrivateRoute path="/customers" component={Customer} type="private"/>
          <PrivateRoute path="/shelves" component={Shelves} type="private"/>
          <PrivateRoute path="/entryexit" component={EntryAndExit} type="private"/>
          <PrivateRoute path="/team" component={Team} type="private"/>
          <Route component={PageNotFound}/>
        </>
        }  
        
        
      </Switch>
      }
    </>
  );
}

export default App;
