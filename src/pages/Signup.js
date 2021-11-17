import React, {useState, useEffect} from "react";
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

const Signup = ({ setToken }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('Password');
    const [confirmPasswordError, setConfirmPasswordError] = useState('Confirm Password');

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);
    const handleMouseDownConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);
    const handleSubmit = async e => {
        if (password != confirmPassword) {
            e.preventDefault();
            return;
        }
        e.preventDefault();
        // const token = await Signup({
        //     username,
        //     password,
        // });
        alert("Signed up");
    };

    useEffect(() => {
        if (password == confirmPassword) {
            setPasswordError('Password');
            setConfirmPasswordError('Confirm Password');
            return;
        }
        setPasswordError('Error');
        setConfirmPasswordError('Error');
    }, [password, confirmPassword]);

    return(
    <React.Fragment>
        <Background imgPath={SignupImage}>
            <form onSubmit={handleSubmit}>
                <Grid container sx={{padding: '50px'}} direction="column" rowSpacing={3} justifyContent="flex-end" alignItems="center">
                    <Grid item>
                        <Typography variant="h3" color="common.white">Create Your Account</Typography>
                    </Grid>
                    <Grid item>
                        <TextField required 
                                    label="Username" 
                                    variant="filled" 
                                    style={{backgroundColor: "white"}} 
                                    onChange={e => setUserName(e.target.value)}
                                    value={username} />
                    </Grid>
                    <Grid item>
                    <TextField type={showPassword ? "text" : "password"} 
                                error={passwordError == 'Error'}
                                required
                                label={passwordError} 
                                variant="filled" 
                                style={{backgroundColor: "white"}} 
                                onChange={e => setPassword(e.target.value)} 
                                helperText={passwordError == 'Error' && 'Passwords must match'}
                                value={password}
                                InputProps={{endAdornment: (
                                <InputAdornment position="end">
                                <IconButton size="small" onClick={handleClickShowPassword}onMouseDown={handleMouseDownPassword}> {showPassword ? <Visibility /> : <VisibilityOff />}</IconButton>
                                </InputAdornment>)
                                }}/>
                    </Grid>
                    <Grid item>
                    <TextField type={showConfirmPassword ? "text" : "password"} 
                                value={confirmPassword}
                                error={confirmPasswordError == 'Error'}
                                required
                                label={confirmPasswordError} 
                                variant="filled" 
                                style={{backgroundColor: "white"}} 
                                helperText={passwordError == 'Error' && 'Passwords must match'}
                                onChange={e => setConfirmPassword(e.target.value)} 
                                InputProps={{endAdornment: (
                                <InputAdornment position="end">
                                <IconButton size="small" onClick={handleClickShowConfirmPassword}onMouseDown={handleMouseDownConfirmPassword}> {showConfirmPassword ? <Visibility /> : <VisibilityOff />}</IconButton>
                                </InputAdornment>)
                            }}/>
                    </Grid>
                    <Grid item>
                        <Button type="submit" variant="contained">Submit</Button>
                    </Grid>
                </Grid>
            </form>
        </Background>
    </React.Fragment>
    )
}

Signup.propTypes = {
    setToken: PropTypes.func.isRequired
};

export default Signup
