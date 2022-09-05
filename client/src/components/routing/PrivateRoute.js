// //import React, { Component } from 'react';
// import React from 'react';
// import {Route, Redirect} from  'react-router-dom';
// import PropTypes from 'prop-types';
// import { connect } from "react-redux";

// const PrivateRoute = ( {component: Component, auth: { isAuthenticated, loading }, ...rest} ) => (
//     <Route  {...rest}  render={props => ! isAuthenticated  && ! loading  ? (<Redirect to="/login" />) : (<Component {...props} />) }/>
// )

// PrivateRoute.propTypes = {
//     auth:PropTypes.object.isRequired,

// }

// const mapToStateProps = state => ({

//     auth: state.auth
//})
    


//export default connect(mapToStateProps)(PrivateRoute);

import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
 
const PrivateRoute = ({
    component: Component,
    auth: { isAuthenticated, loading },
    ...rest
}) => (
    <Route
        {...rest}
        render={(props) =>
            loading ? (
                <Spinner />
            ) : isAuthenticated ? (
                <Component {...props} />
            ) : (
                <Redirect to='/login' />
            )
        }
    />
);
 
PrivateRoute.propTypes = {
    auth: PropTypes.object.isRequired
};
 
const mapStateToProps = (state) => ({
    auth: state.auth
});
 
export default connect(mapStateToProps)(PrivateRoute)
