import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { Button, Typography, TextField, Grid, InputAdornment, IconButton } from "@mui/material";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import axios from 'axios';
import qs from 'qs';
import './Login.css';
import Background from "../components/Background";
import LoginImage from "../images/signinimage.png";

export default function Login() {
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);

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
        <React.Fragment>
            <Background imgPath={LoginImage}>
                <Grid container sx={{padding: '50px'}} direction="column" rowSpacing={3} justifyContent="flex-end" alignItems="center">
                    <Grid item>
                        <Typography variant="h3" color="common.white">Please Log In</Typography>
                    </Grid>
                    <Grid item>
                        <TextField label="Username" variant="filled" style={{backgroundColor: "white"}} onChange={e => setUserName(e.target.value)} />
                    </Grid>
                    <Grid item>
                        <TextField type={showPassword ? "text" : "password"} label="Password" variant="filled" style={{backgroundColor: "white"}} onChange={e => setPassword(e.target.value)} 
                            InputProps={{endAdornment: (
                            <InputAdornment position="end">
                            <IconButton size="small" aria-label="toggle password visibility" onClick={handleClickShowPassword}onMouseDown={handleMouseDownPassword}> {showPassword ? <Visibility /> : <VisibilityOff />}</IconButton>
                            </InputAdornment>)
                        }}/>
                    </Grid>
                    <Grid item>
                        <Button type="submit" variant="contained" onSubmit={handleSubmit}>Submit</Button>
                    </Grid>
                </Grid>
            </Background>
       </React.Fragment>
    )
}
