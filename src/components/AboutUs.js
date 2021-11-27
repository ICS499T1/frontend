
import React from "react";
import Background from "../components/Background";
import AboutImg from "../images/about10.png";
import {Typography, Grid } from "@mui/material";
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Box from "@mui/material/Box";
import './AboutUs.css'

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      'Chilanka',
      'cursive',
    ].join(','),
  },});

function AboutUs() {
  return (
  <ThemeProvider theme={theme}>
    <Background imgPath={AboutImg}>

       <Box className="aboutBox">
       <Grid container columnSpacing={10} rowSpacing={5} justify="flex-start">
       <Grid item xs={12} sm={12} md={12} lg={12}>
       <Typography variant="h3" color="common.white">About Us </Typography>
          <Typography variant="h6" color="common.white">
            We are senior year computer science students at Metropolitan State University.
            Space racer is our final project in our capstone class. We worked through it for
             approximately three months. We came up with this project, as we, as computer
              science students would like to possess a professional typing skill. Our goal was
               not just to provide a quality typing game that will boast one's typing speed
                and accuracy but also make the process super fun.
          </Typography>
         </Grid>
         </Grid>
         </Box>
         <Box className="aboutBox">
          <Grid item xs={12} sm={12} md={12} lg={12}>
          <Typography variant="h4" color="common.white">
                   About Space Racer
           </Typography>
         <Typography variant="h6" color="common.white">
         <br/>
         Typing is not just a cool and fun skill, but it is also an important one.
         </Typography>
         <Typography variant="h6" color="common.white">
         <br/>
             Space Racer is a game-based typing space to improve one’s typing skill,
             where typing speed and accuracy are the keys to win. Space Racer is
             student and beginner friendly game, designed to give feedback on typing
             speed and letter accuracy. Our game supports multiple players to compete
             with each other, allowing friends to spend a quality and fun time enhancing
             their typing speed. Designed with colorful progress bar, leaderboard and
             virtual keyboard with key accuracies that help players aim improvement.
         </Typography>
         <Typography variant="h6" color="common.white">
         <br/>
         While user type their way through the text, a progress bar appears with the progress percentage along with errors made that game. With this users
         can get instant feedback on their keystrokes. Once the finishes their challenge, players can check their accuracy rate for individual keys,
         keys they made mistakes, in the keyboard by hovering through the virtual keyboard provided in the ***. This helps the players to identify
         their weak keys on the keyboard and help improve them. Players can also race with their friends by sharing the multiplayer invite link with friends.
         Leader dashboards ranks the top ** players based on their average game speed.
         These are the best typing game features we've designed for helping players learn to type, increase their typing speed, and develop good keyboarding habits.
         </Typography>
         <Typography variant="h6" color="common.white">
         <br/>
         Is it required to sign-up in order to play?
         <br/>
         	Yes, this helps us maintain your stats. No email address is required.
         </Typography>
         </Grid>
         </Box>
    </Background>
    </ThemeProvider>
  );
}

export default AboutUs;