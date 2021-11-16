import React from 'react'
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom"
import './Footer.css'
import { Button } from '@mui/material';

const Footer = () => {
    return (
        <footer >
            <Box className="box">
            <Grid container columnSpacing={10} rowSpacing={5} justify="flex-start">
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <p className="texttwo" >&copy; Typing Game - 2021.</p>
                    <p className="texttwo">Metropolitan State University,</p>
                    <p className="texttwo">Saint Paul</p>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} >
                    <p>
                    <Button className="links" component={Link} to="/termsandconditions"> 
                        Terms Policy
                    </Button>
                    </p>
                    <p>
                    <Button className="links" component={Link} to="/tutorials"> 
                        Tutorials
                    </Button>
                    </p>
                    <p>
                    <Button className="links" component={Link} to="/aboutus"> 
                        About Us
                    </Button>
                    </p>
                </Grid>
            </Grid>
            </Box>
        </footer>
    )
}

export default Footer;