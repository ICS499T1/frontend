import React, { createContext, useContext } from "react";
import axios from 'axios';
import { useAuthentication } from '../hooks/useAuthentication';
import GLOBAL from '../resources/Global';

const AuthorizationContext = createContext(null);

export const USER_NAME_SESSION_ATTRIBUTE_NAME = 'username';
export const ACCESS_TOKEN_ATTRIBUTE = 'accessToken';
export const REFRESH_TOKEN_ATTRIBUTE = 'refreshToken';

export const AuthorizationProvider = ({ children }) => {
  const { logout } = useAuthentication();

  const instance = axios.create({
      baseURL: GLOBAL.API,
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
    (res) => {
      return res;
    },
    async (err) => {
      const originalConfig = err.config;
      if (originalConfig.url !== "/user/add" && err.response) {
        if (err.response.status === 403 && !originalConfig._retry) {
          originalConfig._retry = true;
          originalConfig.headers["Authorization"] = 'Bearer ' + localStorage.getItem(REFRESH_TOKEN_ATTRIBUTE);
          const refreshInstance = axios.create(originalConfig);
          try {
            const response = await refreshInstance.get("/user/refresh");
            const { accessToken } = response.data;
            const { refreshToken } = response.data;
            localStorage.setItem(ACCESS_TOKEN_ATTRIBUTE, accessToken);
            originalConfig.headers["Authorization"] = 'Bearer ' + accessToken;
            return instance(originalConfig);
          } catch (_error) {
            logout();
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
