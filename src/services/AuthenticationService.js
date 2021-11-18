import axios from 'axios';
import qs from 'qs';

const API_URL = 'http://localhost:8080'

export const USER_NAME_SESSION_ATTRIBUTE_NAME = 'username'
export const ACCESS_TOKEN_ATTRIBUTE = 'accessToken'
export const REFRESH_TOKEN_ATTRIBUTE = 'refreshToken'

class AuthenticationService {

    AuthenticationService() {

    }

    executeBasicAuthenticationService(username, password) {
        const data = {'username':username, 'password':password};
        const options = {
            method: 'POST',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: qs.stringify(data),
            url: `${API_URL}/login`
          };

        return axios(options)
        .then(response => this.registerSuccessfulLoginForJwt(username, response))
        .catch(error => console.log(error));
    }

    registerSuccessfulLoginForJwt(username, response) {
        localStorage.setItem(ACCESS_TOKEN_ATTRIBUTE, response.data.accessToken);
        localStorage.setItem(REFRESH_TOKEN_ATTRIBUTE, response.data.refreshToken);
        if (response.data.accessToken) {
            localStorage.setItem(USER_NAME_SESSION_ATTRIBUTE_NAME, username);
        }
    }

    createJWTToken(token) {
        return 'Bearer ' + token
    }

    logout() {
        localStorage.removeItem(USER_NAME_SESSION_ATTRIBUTE_NAME);
        localStorage.removeItem(ACCESS_TOKEN_ATTRIBUTE);
        localStorage.removeItem(REFRESH_TOKEN_ATTRIBUTE);
    }

    isUserLoggedIn() {
        let user = localStorage.getItem(USER_NAME_SESSION_ATTRIBUTE_NAME)
        if (user === null) return false
        return true
    }

    getLoggedInUserName() {
        let user = localStorage.getItem(USER_NAME_SESSION_ATTRIBUTE_NAME)
        if (user === null) return ''
        return user
    }

    setupAxiosRequestInterceptors(token) {
        axios.interceptors.request.use(
            (config) => {
                if (this.isUserLoggedIn()) {
                    config.headers.authorization = token
                }
                return config
            },
            (error) => {
              return Promise.reject(error);
            }
        );
    }

    setupAxiosResponseInterceptors(token) {
        axios.interceptors.response.use(
            (res) => {
              return res;
            },
            async (err) => {
              const originalConfig = err.config;
          
              if (originalConfig.url !== "/auth/signin" && err.response) {
                // Access Token was expired
                if (err.response.status === 401 && !originalConfig._retry) {
                  originalConfig._retry = true;
          
                  try {
                    const rs = await axios.get(`${API_URL}/user/refresh`, {
                      refreshToken: localStorage.getItem(REFRESH_TOKEN_ATTRIBUTE),
                    });
          
                    const { accessToken } = rs.data;
                    localStorage.setItem(ACCESS_TOKEN_ATTRIBUTE, accessToken);
          
                    return axios(originalConfig);
                  } catch (_error) {
                    this.logout();
                  }
                }
              }
          
              return Promise.reject(err);
            }
          );
    }
}

export default new AuthenticationService()
