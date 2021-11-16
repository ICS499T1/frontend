import React from "react";
import "./Body.css";
import { styled } from "@mui/material/styles";
import Button from "@material-ui/core/Button";
import secondaryImage from "../images/Type.png";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import {BrowserRouter as Router, Link} from "react-router-dom";
import ImageBackground from "../components/ImageBackground";
import background from "../images/Background.png";


const Img = styled("img")({
  maxWidth: "400px",
});


const Body = () => {
  return (
    <React.Fragment>
      
        {/* <header>
        <Router>
            <div>
              <img className="imgcontainer" alt="background" src={background} />
              <Button class="soloplay">Solo Play</Button>
              <Button class="multiplay">Multi Play</Button>
            </div>
          </Router>
        </header> */}
        <ImageBackground image={background}/>
          <Box class="whitebox">
            <Grid container columnSpacing={5} rowSpacing={5} justify="flex-start">
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <Img src={secondaryImage} />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <Grid item>
                  <div>
                    <p class="textone">WHAT IS TYPINGGAME?</p>
                    <h3 class="text">
                      TypingGame is the most effective way to improve typing
                      skills.
                    </h3>
                    <Button class="startnowbutton">Get Started Now</Button>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Box> 

          <Box class="boxone">
            <Grid container columnSpacing={5} justify="flex-start">
              <Grid item xs={12} sm={12} md={4} lg={4} textAlign="center">
                <p class="textBar">2+ Users</p>
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
                <p class="textBar">Individual and Group Races</p>
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
                <p class="textBar">Interactive Experience</p>
              </Grid>
            </Grid>
          </Box>

          <Box class="boxtwo">
            <Grid container columnSpacing={5} rowSpacing={5} justify="flex-start">
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <h2 class="subtitle">How do I get started?</h2>
                <p>
                  Keep practicing until you get all five starts, it really doesn't
                  take much to learn, a few minutes a day for one or two weeks and
                  you will be a pro!
                </p>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <h2 class="subtitle">Do I need an account?</h2>
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