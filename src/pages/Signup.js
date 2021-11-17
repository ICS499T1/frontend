import React, {useState} from "react";
import { Button, Typography, TextField, Grid, InputAdornment, IconButton } from "@mui/material";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import PropTypes from "prop-types";
import './Signup.css'
import Background from "../components/Background";
import SignupImage from "../images/signupimage.png"
// import background from '../images/BackgroundTwo.png';


//async function signupUser(credentials) {
//    return fetch('http://localhost:8080/signup', {
//        method: 'POST',
//        headers: {
//            'Content-Type': 'application/json'
//        },
//        body: JSON.stringify(credentials)
//    })
//        .then(data => data.json())
//}

export default function Signup({ setToken }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassowrd, setConfirmPassword] = useState(false);
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);
    const handleClickShowConfirmPassword = () => setConfirmPassword(!showConfirmPassowrd);
    const handleMouseDownConfirmPassword = () => setConfirmPassword(!showConfirmPassowrd);
    const handleSubmit = async e => {
        e.preventDefault();
        const token = await Signup({
            username,
            password,
        });
        setToken(token);
    }

    return(
    <React.Fragment>
        <Background imgPath={SignupImage}>
            <Grid container sx={{padding: '50px'}} direction="column" rowSpacing={3} justifyContent="flex-end" alignItems="center">
                <Grid item>
                    <Typography variant="h3" color="common.white">Create Your Account</Typography>
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
                <TextField type={showConfirmPassowrd ? "text" : "password"} label="Confirm Password" variant="filled" style={{backgroundColor: "white"}} onChange={e => setPassword(e.target.value)} 
                            InputProps={{endAdornment: (
                            <InputAdornment position="end">
                            <IconButton size="small" aria-label="toggle password visibility" onClick={handleClickShowConfirmPassword}onMouseDown={handleMouseDownConfirmPassword}> {showConfirmPassowrd ? <Visibility /> : <VisibilityOff />}</IconButton>
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

Signup.propTypes = {
    setToken: PropTypes.func.isRequired
};