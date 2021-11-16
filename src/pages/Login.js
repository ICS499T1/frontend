import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import Button from "@mui/material/Button";
import axios from 'axios';
import qs from 'qs';
import { successfulAuth } from '../services/AuthenticationService';
import './Login.css';

export default function Login() {
    let history = useHistory();

    const [username, setUserName] = useState();
    const [password, setPassword] = useState();

    const data = {'username':username, 'password':password};

    const options = {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: qs.stringify(data),
        url: 'http://localhost:8080/login'
      };

    const handleSubmit = async e => {
        e.preventDefault();
        axios(options).then(response => {
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            if (response.data.accessToken) {
                localStorage.setItem('username', jwt_decode(response.data.accessToken).sub);
            }
        });
        
    }

    return(
        <div className="login-wrapper">
            <h1>Please Log In</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Username</p>
                    <input type="text" onChange={e => setUserName(e.target.value)} />
                </label>
                <label>
                    <p>Password</p>
                    <input type="password" onChange={e => setPassword(e.target.value)} />
                </label>
                <div>
                    <Button type="submit" variant="contained">Submit</Button>
                </div>
            </form>
        </div>
    )
}
