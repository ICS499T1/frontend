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
import Leaderboard from "../components/Leaderboards/Leaderboard";


const Img = styled("img")({
  maxWidth: "400px",
});

const styles = {
  paperContainer: {
    height: 800,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundImage: `url(${background})`,
    backgroundColor: '#2E2F43'
  }
};

const Body = () => {
  return (
    <React.Fragment>
  
            {/* <Box>
              <img className="imgcontainer" alt="background" src={background} />
              <Button variant="contained">Solo Play</Button>
              <Button>Multi Play</Button>
            </Box> */}

          <Paper style={styles.paperContainer}>
            <Grid container columnSpacing={10} justifyContent="center" alignItems="flex-end">
              <Grid item>
                <Button variant="contained">Practice</Button>
              </Grid>
              <Grid item>
                <Button variant="contained">Play With Friends</Button>
              </Grid>
            </Grid>
          </Paper>
          <Leaderboard/>
          <Box className="whitebox">
            <Grid container columnSpacing={5} rowSpacing={5} justify="flex-start">
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <Img src={secondaryImage} />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <Grid item>
                  <div>
                    <p className="textone">WHAT IS TYPINGGAME?</p>
                    <h3 className="text">
                      TypingGame is the most effective way to improve typing
                      skills.
                    </h3>
                    <Button className="startnowbutton">Get Started Now</Button>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Box> 

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

          <Box className="boxtwo">
            <Grid container columnSpacing={5} rowSpacing={5} justify="flex-start">
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <h2 className="subtitle">How do I get started?</h2>
                <p>
                  Keep practicing until you get all five starts, it really doesn't
                  take much to learn, a few minutes a day for one or two weeks and
                  you will be a pro!
                </p>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <h2 className="subtitle">Do I need an account?</h2>
                <p>
                  You don't need to create an account. You can play solo or
                  multiplayer games anonimously. However, you might consider
                  getting an account if you would like to keep track of your
                  results.
                </p>
              </Grid>
            </Grid>
          </Box>
    </React.Fragment>
  );
};


export default Body;