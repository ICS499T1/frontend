import React from 'react'
import './Body.css'
import { styled } from '@mui/material/styles';
import Button from "@material-ui/core/Button";
// import background from './images/Background.png'; 
import secondaryImage from '../images/Type.png'; 
import background from '../images/Background.png'; 
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
            <header>
                <div>
                    <img class="imgcontainer" src={background}/>
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
                        <Grid item xs container direction="column">
                            <Grid item xs>
                                    <div>
                                        <h4 class="textone">WHAT IS TYPINGGAME?</h4>
                                        <h3 class="text">TypingGame is the most effective way to improve typing skills.</h3>
                                        <Button class="startnowbutton">Get Started Now</Button>
                                    </div>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
  
            <Box sx={{ flexGrow: 1 }} class="box">
                <Grid container spacing={2} columns={16}>
                    <Grid item xs={8}>
                        <h3 class="textBarone">Individual and Group Stats</h3>
                    </Grid>
                    <Grid item xs container direction="column" spacing={5}>
                        <Grid item xs={8}>
                            <h3 class="textBartwo">Interactive Experience</h3>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </React.Fragment>
    )
}

export default Body;