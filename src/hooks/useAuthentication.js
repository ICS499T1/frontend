import React, { useState, createContext, useContext } from "react";
import axios from 'axios';
import qs from 'qs';
import GLOBAL from '../resources/Global';

const AuthenticationContext = createContext(null);


export const USER_NAME_SESSION_ATTRIBUTE_NAME = 'username';
export const ACCESS_TOKEN_ATTRIBUTE = 'accessToken';
export const REFRESH_TOKEN_ATTRIBUTE = 'refreshToken';

export const AuthenticationProvider = ({ children }) => {

   const [authed, setAuthed] = useState((localStorage.getItem('accessToken') ? true : false));

   const login = async (username, password) => {
        const data = {'username':username, 'password':password};
        const options = {
            method: 'POST',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: qs.stringify(data),
            url: `${GLOBAL.API}/login`
        };

        return axios(options)
        .then(response => successfulLogin(username, response))
        .catch(error => error.response);
    };

    const signup = async (username, password) => {
        const data = {'username':username, 'password':password};
        const options = {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            data: JSON.stringify(data),
            url: `${GLOBAL.API}/user/add`
        };

        return axios(options)
        .then(response => response)
        .catch(error => error.response);
    };


    const successfulLogin = (username, response) => {
        localStorage.setItem(ACCESS_TOKEN_ATTRIBUTE, response.data.accessToken);
        localStorage.setItem(REFRESH_TOKEN_ATTRIBUTE, response.data.refreshToken);
        if (response.data.accessToken) {
            localStorage.setItem(USER_NAME_SESSION_ATTRIBUTE_NAME, username);
            setAuthed(true);
        }
        return response;
    };

    const logout = () => {
        localStorage.removeItem(USER_NAME_SESSION_ATTRIBUTE_NAME);
        localStorage.removeItem(ACCESS_TOKEN_ATTRIBUTE);
        localStorage.removeItem(REFRESH_TOKEN_ATTRIBUTE);
        setAuthed(false);
    };

   return (
			// Using the provider so that ANY component in our application can 
			// use the values that we are sending.
      <AuthenticationContext.Provider value={{ authed, setAuthed, login, signup, logout }}>
         {children}
      </AuthenticationContext.Provider>
   );
};

// Finally creating the custom hook 
export const useAuthentication = () => useContext(AuthenticationContext);