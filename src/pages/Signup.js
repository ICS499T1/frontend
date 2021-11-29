import React, { useState, useEffect } from "react";
import {
  Collapse,
  Alert,
  Button,
  Typography,
  TextField,
  Grid,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { Link } from "react-router-dom";
import Background from "../components/Background";
import SignupImage from "../images/astronauts.jpeg";
import { useAuthentication } from "../hooks/useAuthentication";
import CloseIcon from '@mui/icons-material/Close';

const Signup = () => {
  const { signup, authed } = useAuthentication();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("Password");
  const [confirmPasswordError, setConfirmPasswordError] =
    useState("Confirm Password");
  const [success, setSuccess] = useState(false);
  const [usernameExists, setUsernameExists] = useState(false);
  const [invalidUsernameChars, setInvalidUsernameChars] = useState(false);
  const [invalidUsernameLength, setInvalidUsernameLength] = useState(false);
  const [serverDown, setServerDown] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);
  const handleMouseDownConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);
  const handleSubmit = async (e) => {
    if (password !== confirmPassword) {
      e.preventDefault();
      return;
    }
    if (!/^([A-Za-z0-9]{1,})$/.test(username)) {
      e.preventDefault();
      setInvalidUsernameChars(true);
      return;
    }
    if (username.length < 4 || username.length > 16) {
      e.preventDefault();
      setInvalidUsernameLength(true);
      return;
    }
    e.preventDefault();
    let returnVal = await signup(username, password);
    if (!returnVal || !returnVal.status) {
      setServerDown(true);
    } else if (returnVal.status === 200) {
      setSuccess(true);
    } else if (returnVal.status === 500) {
      setUsernameExists(true);
    };
  };

  useEffect(() => {
    if (password === confirmPassword) {
      setPasswordError("Password");
      setConfirmPasswordError("Confirm Password");
      return;
    }
    setPasswordError("Error");
    setConfirmPasswordError("Error");
  }, [password, confirmPassword]);

  const handleUsername = (username) => {
    setUserName(username);
    setInvalidUsernameChars(false);
    setInvalidUsernameLength(false);
    setUsernameExists(false);
  }

  return (
    <React.Fragment>
      <Background imgPath={SignupImage}>
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
        {success && (
          <Grid
            container
            sx={{ padding: "50px" }}
            direction="column"
            rowSpacing={3}
            justifyContent="flex-end"
            alignItems="center"
          >
            <Typography variant="h3" color="common.white">
              Your account has been created
            </Typography>
            <br />
            <Button size="large" variant="contained" component={Link} to="/login">
              Login
            </Button>
          </Grid>
        )}
        {authed && (
          <Grid
            container
            sx={{ padding: "50px" }}
            direction="column"
            rowSpacing={3}
            justifyContent="flex-end"
            alignItems="center"
          >
            <Typography variant="h3" color="common.white">
              You are already Logged In
            </Typography>
          </Grid>
        )}
        {!authed && !success && (
          <form onSubmit={handleSubmit}>
            <Grid
              container
              sx={{ padding: "50px" }}
              direction="column"
              rowSpacing={3}
              justifyContent="flex-end"
              alignItems="center"
            >
              <Grid item>
                <Typography variant="h3" color="common.white">
                  Create Your Account
                </Typography>
              </Grid>
              <Grid item>
                <TextField
                  required
                  label="Username"
                  error={usernameExists || invalidUsernameChars || invalidUsernameLength}
                  helperText={
                    (usernameExists && "Username is already taken.") || 
                    (invalidUsernameChars && "Username can only contain letters and numbers.") ||
                    (invalidUsernameLength && "Username must contain 4-16 characters.")
                  }
                  variant="filled"
                  style={{ backgroundColor: "white" }}
                  onChange={(e) => handleUsername(e.target.value)}
                  value={username}
                />
              </Grid>
              <Grid item>
                <TextField
                  type={showPassword ? "text" : "password"}
                  error={passwordError === "Error"}
                  required
                  label={passwordError}
                  variant="filled"
                  style={{ backgroundColor: "white" }}
                  onChange={(e) => setPassword(e.target.value)}
                  helperText={
                    passwordError === "Error" && "Passwords must match"
                  }
                  value={password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {" "}
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item>
                <TextField
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  error={confirmPasswordError === "Error"}
                  required
                  label={confirmPasswordError}
                  variant="filled"
                  style={{ backgroundColor: "white" }}
                  helperText={
                    passwordError === "Error" && "Passwords must match"
                  }
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={handleClickShowConfirmPassword}
                          onMouseDown={handleMouseDownConfirmPassword}
                        >
                          {" "}
                          {showConfirmPassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item>
                <Button size="large" type="submit" variant="contained">
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Background>
    </React.Fragment>
  );
};

export default Signup;
