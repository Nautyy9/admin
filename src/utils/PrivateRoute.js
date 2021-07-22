import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../context/auth';

/**
It makes the routes autheticated by checking the context data and further validating state.
Also to make guest links i.e. login which can't be accessed by logged in user.
 */

const PrivateRoute = ({type,component: RouteComponent,...rest}) => {
    const {currentUser} = useContext(AuthContext);
    // const { type } = props;
    // if (type === "guest" && currentUser) return <Redirect to="/"/>;
    // else if (type === "private" && !currentUser) return <Redirect to="/login" />;

    // return <Route {...props} />;

    return(
        <Route
            {...rest}
            render={ routeProps =>
                !!currentUser && type==="guest" ? (
                    <Redirect to="/"/>
                )
                :
                !currentUser && type==="private" ? (
                    <Redirect to="/login"/>
                )
                :
                <RouteComponent {...routeProps}/>

            }
        
        />
    )
};


export default PrivateRoute;