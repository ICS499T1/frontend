import React from 'react'
import './Body.css'
import { styled } from '@mui/material/styles';
import Button from "@material-ui/core/Button";
// import background from './images/Background.png'; 
import secondaryImage from '../images/Type.png'; 
import Grid from '@mui/material/Grid';
import { Typography } from "@material-ui/core";
import Container from '@mui/material/Box';
import Box from '@mui/material/Box';


const Img = styled('img')({
    maxWidth: '400px',
    marginRight: '100px',
  });
  
const Body = () => {
    return (
        <React.Fragment>
            <header className="bg-image">
                <div>
                    <Button class="soloplay">Solo Play</Button>
                    <Button class="multiplay">Multi Play</Button>
                </div>
            </header> 
            <Container class="container">
                <Grid container alignItems="center">
                    <Grid item>
                        <Img  src={secondaryImage}/>
                    </Grid>
                    <Grid item xs={12} sm container>
                        <Grid item xs container direction="column" spacing={2}>
                            <Grid item xs>
                                <Typography gutterBottom variant="subtitle1" component="div">
                                    <div>
                                        <h3 class="text">WHAT IS TYPINGGAME? <br /><br />TypingGame is the most effective way to improve typing skills.</h3>
                                        <Button class="startnowbutton">Get Started Now</Button>
                                    </div>
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
  
            <Box sx={{ flexGrow: 1 }} class="box">
                <Grid container spacing={5} columns={16}>
                    <Grid item xs={8}>
                        <h3 class="textBarone"> Tricky Keys Map</h3>
                    </Grid>
                    <Grid item xs container direction="column" spacing={5}>
                        <Grid item xs={8}>
                            <h3 class="textBartwo"> Interactive Experience</h3>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </React.Fragment>
    )
}

export default Body;