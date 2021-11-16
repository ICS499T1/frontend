import { Box, Container, AppBar, CssBaseline, Toolbar, Typography, SvgIcon } from "@mui/material";
import React from "react";
import { ReactComponent as Logo } from "../../images/C.B.C_Rocket.svg";
import { Link } from "react-router-dom"
import "./Navbar.css";

const Navbar = () => {
  return (
    // <Box sx={{ flexGrow: 1}}>
      <AppBar color="" position="static">
        <CssBaseline />
        <Toolbar>
          <SvgIcon sx={{
            p: 1,
            fontSize: '75px'
          }}>
            <Logo />
          </SvgIcon>
          <Typography variant="h4">
            Space Racer
          </Typography>
            <Container>
              <Link to="/">
                Home
              </Link>
              <Link to="/signUp">
                Sign up
              </Link>
              <Link to="/login">
                Login
              </Link>
              <Link to="/faq">
                FAQ
              </Link>
            </Container>
        </Toolbar>
      </AppBar>
    // </Box>


    // <nav className="header">
    //   <div className="nav-wrapper">
    //     <a className="logo" href="/">
    //       StartTyper
    //     </a>
    //     <input className="menu-btn" type="checkbox" id="menu-btn" />
    //     <label className="menu-icon" htmlFor="menu-btn">
    //       <span className="navicon"></span>
    //     </label>

    //     <ul className="menu">
    //       <li>
    //         <Link to="/">Home</Link>
    //       </li>
    //       <li>
    //         <Link to="/signUp">Sign up</Link>
    //       </li>
    //       <li>
    //         <Link to="/login">Log in</Link>
    //       </li>
    //     </ul>
    //   </div>
    // </nav>
  );
};

export default Navbar;
