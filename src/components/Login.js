import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from "@mui/material/Button";
import axios from 'axios';
import qs from 'qs';
import './Login.css';

export default function Login() {
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
        axios(options).then(data => {
            console.log(data);
            localStorage.setItem('accesToken', data.accessToken);
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
