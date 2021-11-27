import React from 'react'
import { Link } from "react-router-dom"
import { Button, AppBar, Grid, Typography } from '@mui/material';

const Footer = () => {
    return (
        <AppBar position="relative" color="primary" sx={{ top: 'auto', bottom: 0 }}>
            <Grid container columnSpacing={10} rowSpacing={5} color="primary" justify="flex-start">
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <Typography mt={5}>&copy; Space Racer - 2021.</Typography>
                    <Typography mt={3}>Metropolitan State University,</Typography>
                    <Typography mt={3} mb={5}>Saint Paul</Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <Grid item mt={2} mb={5}>
                        <Button color="inherit" component={Link} to="/aboutus" variant="text"> About Us</Button>
                    </Grid>
                </Grid>
            </Grid>
        </AppBar>
    )
}

export default Footer;