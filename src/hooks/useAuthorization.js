import React, { createContext, useContext } from "react";
import axios from 'axios';

const AuthorizationContext = createContext(null);

const API_URL = 'http://localhost:8080';

export const USER_NAME_SESSION_ATTRIBUTE_NAME = 'username';
export const ACCESS_TOKEN_ATTRIBUTE = 'accessToken';
export const REFRESH_TOKEN_ATTRIBUTE = 'refreshToken';

export const AuthorizationProvider = ({ children }) => {

    const instance = axios.create({
        baseURL: `${API_URL}`,
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      instance.interceptors.request.use(
        (config) => {
          const token = localStorage.getItem("accessToken");
          if (token) {
            config.headers["Authorization"] = 'Bearer ' + token; 
          }
          return config;
        },
        (error) => {
          return error;
        }
      );
      
      instance.interceptors.response.use(
        async (res) => {
          return res;
        },
        async (err) => {
          const originalConfig = err.config;
      
          if (originalConfig.url !== "/user/add" && err.response) {
            if (err.response.status === 401 && !originalConfig._retry) {
              originalConfig._retry = true;
              try {
                const response = await instance.post("/user/refresh", {
                  refreshToken: localStorage.getItem(REFRESH_TOKEN_ATTRIBUTE),
                });
                const { accessToken } = response.data;
                localStorage.setItem(ACCESS_TOKEN_ATTRIBUTE, accessToken);
                return instance(originalConfig);
              } catch (_error) {
                return _error;
              }
            }
          }
          return err;
        }
      );
    
    return (
        <AuthorizationContext.Provider value={{ instance }}>
            {children}
        </AuthorizationContext.Provider>
    );
};

export const useAuthorization = () => useContext(AuthorizationContext);
