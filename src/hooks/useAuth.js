import React, { useState, createContext, useContext, useEffect } from "react";
import axios from 'axios';
import qs from 'qs';

// Create the context 
const AuthContext = createContext(null);

const API_URL = 'http://localhost:8080';

export const USER_NAME_SESSION_ATTRIBUTE_NAME = 'username';
export const ACCESS_TOKEN_ATTRIBUTE = 'accessToken';
export const REFRESH_TOKEN_ATTRIBUTE = 'refreshToken';

export const AuthProvider = ({ children }) => {

	 // Using the useState hook to keep track of the value authed (if a 
   // user is logged in)
   const [authed, setAuthed] = useState((localStorage.getItem('accessToken') ? true : false));

   const login = async (username, password) => {
        const data = {'username':username, 'password':password};
        const options = {
            method: 'POST',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: qs.stringify(data),
            url: `${API_URL}/login`
        };

        return axios(options)
        .then(response => successfulLogin(username, response))
        .catch(error => error.response.status);
    };

    const signup = async (username, password) => {
        const data = {'username':username, 'password':password};
        const options = {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            data: JSON.stringify(data),
            url: `${API_URL}/user/add`
        };

        return axios(options)
        .then(response => response.status)
        .catch(error => error.response.status);
    };


    const successfulLogin = (username, response) => {
        localStorage.setItem(ACCESS_TOKEN_ATTRIBUTE, response.data.accessToken);
        localStorage.setItem(REFRESH_TOKEN_ATTRIBUTE, response.data.refreshToken);
        if (response.data.accessToken) {
            localStorage.setItem(USER_NAME_SESSION_ATTRIBUTE_NAME, username);
            setAuthed(true);
        }
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
      <AuthContext.Provider value={{ authed, setAuthed, login, signup, logout }}>
         {children}
      </AuthContext.Provider>
   );
};

// Finally creating the custom hook 
export const useAuth = () => useContext(AuthContext);