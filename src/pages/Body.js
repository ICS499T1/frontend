import React from "react";
import "./Body.css";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button"
import secondaryImage from "../images/Type.png";
import Grid from "@mui/material/Grid";

import Box from "@mui/material/Box";
import Paper from '@mui/material/Paper'
import {BrowserRouter as Router, Link} from "react-router-dom";
import ImageBackground from "../components/ImageBackground";
import background from "../images/backgroundHD.jpg";
import { Container } from "semantic-ui-react";
import Background from '../components/Background';
import CustomButton from '../components/CustomButton';
import Leaderboard from "../components/Leaderboards/Leaderboard";


const Img = styled("img")({
  maxWidth: "400px",
});

const Body = () => {
  return (
    <React.Fragment>
            {/* <Box>
              <img className="imgcontainer" alt="background" src={background} />
              <Button variant="contained">Solo Play</Button>
              <Button>Multi Play</Button>
            </Box> */}
          <Background imgPath={background}>
              <Grid sx={{padding: '100px'}} direction="column" rowSpacing={3} container justifyContent="flex-end" alignItems="center" >
                {/* <Button size="large" variant="contained" style={styles.practiceButton}>Practice</Button>
                <Button size="large" variant="contained" style={styles.createButton}>Create Game</Button>
                <Button size="large" variant="contained" style={styles.joinButton}>Join Game</Button> */}
                <Grid item>
                    <Button component={Link} to="/soloplay" size="large" variant="contained">Practice</Button>
                </Grid>
                <Grid item>
                    <Button component={Link} to="/multiplay" size="large" variant="contained">Play with Friends</Button>
                </Grid>
                {/* <Grid item>
                    <Button component={Link} to="/multiplay" size="large" variant="contained">Join Game</Button>
                </Grid> */}
                {/* <Grid item>
                  <CustomButton name="Practice" top="45%" right="0%" left="20%" bottom="0%"/>
                </Grid>
                <Grid item>
                  <CustomButton name="Create Game" top="55%" right="0%" left="20%" bottom="0%"/>
                </Grid>
                <Grid item>
                  <CustomButton name="Join Game" top="65%" right="0%" left="20%" bottom="0%"/>
                </Grid> */}
              </Grid>
          </Background>
          <Leaderboard/>
          <Box className="boxone">
            <Grid container columnSpacing={5} justify="flex-start">
              <Grid item xs={12} sm={12} md={4} lg={4} textAlign="center">
                <p className="textBar">2+ Users</p>
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={4}
                lg={4}
                order={{ xs: 2, sm: 3 }}
                textAlign="center"
              >
                <p className="textBar">Individual and Group Races</p>
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={4}
                lg={4}
                order={{ xs: 2, sm: 3 }}
                textAlign="center"
              >
                <p className="textBar">Interactive Experience</p>
              </Grid>
            </Grid>
          </Box>
          <Box className="whitebox">
            <Grid container columnSpacing={5} rowSpacing={5} justify="flex-start">
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <Img src={secondaryImage} />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <Grid item>
                  <div>
                    <p className="textone">HOW TO PLAY SPACE RACER?</p>
                    <h3 className="text">
                      Space Racer is a typing game where you can practice by yourself 
                      or play with friends by creating or joining a game.
                    </h3>
                    <CustomButton name="Get Started Now" top="50%" right="10%" left="0%" bottom="0%"/>
                    {/* <Button className="startnowbutton" variant="contained">Get Started Now</Button> */}
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Box> 
      </React.Fragment>
  );
};


export default Body;