/* eslint-disable import/no-anonymous-default-export */
// import { REGISTER_SUCCESS, REGISTER_FAIL, USER_LOADED, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT } from '../actions/types';

// const initialState = {
//     token : localStorage.getItem('token'),
//     isAuthenticated : null,
//     loading: true,
//     user : null
// };

// export default function(state = initialState, action){

//     const { type, payload } = action;
    
//     switch(type)  
//     {
//         case REGISTER_SUCCESS:
//         case LOGIN_SUCCESS:
//             localStorage.setItem('token', payload.token);
//             return {
//                 ...state, 
//                 ...payload,
//                 isAuthenticated: true,
//                 loading: false 

//             };
//         case REGISTER_FAIL:
//         case AUTH_ERROR:
//         case LOGIN_FAIL:
//         case LOGOUT:
//             localStorage.removeItem('token');
//             return {
//                 ...state, 
//                 token: null,
//                 isAuthenticated: false,
//                 loading: false,
//             };
//         case USER_LOADED:
//                 return {
//                     ...state, 
//                     isAuthenticated: true,
//                     loading: false,
//                     user: payload 
    
//                 };
//         default:
//             return state; 
//     }
// }

import {
    REGISTER_SUCCESS,
    //REGISTER_FAIL,
    REGISTER_TRIAL_SUCCESS,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    //LOGIN_FAIL,
    LOGOUT,
    //ACCOUNT_DELETED
  } from '../actions/types';
  
  const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null
  };
  
  export default function (state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case USER_LOADED:
        return {
          ...state,
          isAuthenticated: true,
          loading: false,
          user: payload
        };
      case REGISTER_SUCCESS:
        return {
          ...state,
          ...payload,
          isAuthenticated: true,
          loading: false
        };
        case REGISTER_TRIAL_SUCCESS:
          return {
            ...state,
            ...payload,
            isAuthenticated: true,
            loading: false
          };
      case LOGIN_SUCCESS:
        return {
          ...state,
          ...payload,
          isAuthenticated: true,
          loading: false
        };
      case AUTH_ERROR:
      case LOGOUT:
        return {
          ...state,
          token: null,
          isAuthenticated: false,
          loading: false,
          user: null
        };
      default:
        return state;
    }
  }