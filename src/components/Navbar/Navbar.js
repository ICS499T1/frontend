import { Button, ButtonGroup, Container, AppBar, CssBaseline, Toolbar, Typography, SvgIcon } from "@mui/material";
import React from "react";
import Grid from "@mui/material/Grid";
import { ReactComponent as Logo } from "../../images/C.B.C_Rocket.svg";
import { Link } from "react-router-dom";
import { useNavbarStyle } from "../../hooks/useNavbarStyle";
import { useAuthentication } from "../../hooks/useAuthentication";

const Navbar = () => {
  const classes = useNavbarStyle();
  const { logout, authed } = useAuthentication();

  return (
    <Grid container>
      <AppBar position="static">
        <CssBaseline />
        <Toolbar>
          <SvgIcon sx={{
            p: 1,
            fontSize: '75px'
          }}>
            <Logo />
          </SvgIcon>
          <Typography sx={{cursor: 'pointer'}} onClick={event =>  window.location.href='/'} variant="h4">
            Space Racer
          </Typography>
          <section className={classes.rightToolbar}>
            <Container>
              <ButtonGroup>
                <Button component={Link} to="/" variant="text" color="inherit">Home</Button>
                {!authed && <Button component={Link} to="/signUp" variant="text" color="inherit">Sign Up</Button>}
                {!authed && <Button component={Link} to="/login" variant="text" color="inherit">Login</Button>}
                {authed && <Button component={Link} to="/myprofile" variant="text" color="inherit">{localStorage.getItem('username')}</Button>}
                {authed && <Button component={Link} to="/" onClick={logout} variant="text" color="inherit">Logout</Button>}
              </ButtonGroup>
            </Container>
          </section>
        </Toolbar>
      </AppBar>
    </Grid>
  );
};

export default Navbar;
