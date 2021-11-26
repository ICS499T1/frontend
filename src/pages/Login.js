import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Alert, Collapse, Button, Typography, TextField, Grid, InputAdornment, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Background from "../components/Background";
import LoginImage from "../images/signinimage.png";
import { useAuthentication } from '../hooks/useAuthentication';
import CloseIcon from '@mui/icons-material/Close';



const Login = () => {
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);
    const [error, setError] = useState(null);
    const [serverDown, setServerDown] = useState(false);
    const { login, authed } = useAuthentication();

    const history = useHistory();

    const handleUsernameChange = e => {
        setUserName(e.target.value);
        setError(null);
    }

    const handlePasswordChange = e => {
        setPassword(e.target.value);
        setError(null);
    }


    const handleSubmit = async e => {
        e.preventDefault();
        let returnVal = await login(username, password);
        if (returnVal === 403) {
            setError(returnVal);
            return;
        } else if (returnVal === 200) {
            setServerDown(false);
        } else if (returnVal) {
            console.log(returnVal);
            if (!returnVal.status) {
                setServerDown(true);
            }
            return;
        };
        history.push("/");
    }

    return(
        <React.Fragment>
            <Background imgPath={LoginImage}>
                <Grid 
                    container
                    sx={{ padding: "50px" }}
                    direction="column"
                    rowSpacing={3}
                    justifyContent="flex-end"
                    alignItems="center">
                <Collapse in={serverDown}>
                    <Alert
                    severity="error"
                    action={
                    <IconButton
                        color="inherit"
                        size="small"
                        onClick={() => {
                        setServerDown(false);
                        }}
                    >
                    <CloseIcon fontSize="inherit" />
                    </IconButton>
                    }
                    sx={{ mb: 2 }}>
                    Cannot connect to server!
                    </Alert>
                </Collapse>
                </Grid>
                { authed && 
                <Grid container sx={{padding: '50px'}} direction="column" rowSpacing={3} justifyContent="flex-end" alignItems="center">
                    <Typography variant="h3" color="common.white">You are already Logged In</Typography>
                </Grid>}
                { !authed &&
                <form onSubmit={handleSubmit}>
                    <Grid container sx={{padding: '50px'}} direction="column" rowSpacing={3} justifyContent="flex-end" alignItems="center">
                        <Grid item>
                            <Typography variant="h3" color="common.white">Please Log In</Typography>
                        </Grid>
                        <Grid item>
                            <TextField required={true} 
                                        label="Username" 
                                        error={error === 403} 
                                        helperText={error === 403 && "Incorrect credentials"}
                                        variant="filled" 
                                        style={{backgroundColor: "white"}} 
                                        onChange={handleUsernameChange} />
                        </Grid>
                        <Grid item>
                            <TextField required={true} 
                                        type={showPassword ? "text" : "password"} 
                                        error={error === 403} 
                                        label="Password" variant="filled" 
                                        style={{backgroundColor: "white"}} 
                                        helperText={error === 403 && "Incorrect credentials"}
                                        onChange={handlePasswordChange} 
                                        InputProps={{endAdornment: (
                                        <InputAdornment position="end">
                                        <IconButton size="small" onClick={handleClickShowPassword}onMouseDown={handleMouseDownPassword}> {showPassword ? <Visibility /> : <VisibilityOff />}</IconButton>
                                        </InputAdornment>)
                            }}/>
                        </Grid>
                        <Grid item>
                            <Button type="submit" variant="contained">Submit</Button>
                        </Grid>
                        <Grid item>
                        <Typography variant="p" color="common.white"> Don't have an account? Please <Link to="/signUp">Sign Up</Link></Typography>
                        </Grid>
                    </Grid>
                </form>}

                
            </Background>
       </React.Fragment>
    )
}

export default Login
