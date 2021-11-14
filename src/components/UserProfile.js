import React, { Component } from "react";
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import Keyboardpage from "../components/Keyboard.js";
import "react-simple-keyboard/build/css/index.css";
import "./UserProfile.css";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Link } from "@mui/material";
import BackgroundLetterAvatars from "../components/Avatar.js";
import { useEffect, useState, useRef } from "react";
import tokenUnavailable from '../services/AuthenticationService';

function UserProfile() {

  localStorage.setItem('lastLocation', '/myprofile');

  let history = useHistory();
  tokenUnavailable(history);

  const [user, setUser] = useState({
    username: null,
    userStats: {averageSpeed: null, racesWon: null, bestRaceSpeed: null, numMultiGamesCompleted: null}
  });

  const options = {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` },
    url: `http://localhost:8080/user/getuser?username=${localStorage.getItem('username')}`
  };

  useEffect(() => {
    axios(options).then(response => response.data).then(result => {
      console.log(result);
      setUser({username:result.username,
        userStats: {averageSpeed: result.userStats.averageSpeed, racesWon: result.userStats.racesWon, 
          numMultiGamesCompleted: result.userStats.numMultiGamesCompleted, bestRaceSpeed: result.userStats.bestRaceSpeed
        }
      });
    });
  }, []);

  return (
    <React.Fragment>
      <Box class="bigbox">
        <div>
          <h1 class="title"> Welcome back, {user.username}!</h1>
        </div>
        <Box class="boxuser">
          <Card class="card">
            <CardContent class="cardcontent">
              <Grid container columnSpacing={5} rowSpacing={3}>
                <Grid item>
                  <div>
                  {BackgroundLetterAvatars("Ksenia")}
                  </div>
                </Grid>
                <Grid item xs={12} sm container>
                  <Grid item>
                    <div>
                      <p>Username: {user.username} </p>
                      <Link>Edit Profile</Link>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>

        {/* Stats display row 1 */}
        <Box class="boxstats">
          <Grid container columnSpacing={5} rowSpacing={4} justify="flex-start">
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Card class="card">
                <CardContent class="cardcontent">
                  <p class="subtitles">Average Speed</p>
                  <h5 class="textstats">{user.userStats.averageSpeed}</h5>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Card class="card">
                <CardContent class="cardcontent">
                  <p class="subtitles">Races Won</p>
                  <h5 class="textstats">{user.userStats.racesWon}</h5>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Stats display row 2 */}
        <Box class="boxstats">
          <Grid container columnSpacing={5} rowSpacing={4} justify="flex-start">
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Card class="card">
                <CardContent class="cardcontent">
                  <p class="subtitles">Races Played</p>
                  <h5 class="textstats">{user.userStats.numMultiGamesCompleted}</h5>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Card class="card">
                <CardContent class="cardcontent">
                  <p class="subtitles">Highest Score</p>
                  <h5 class="textstats">{user.userStats.bestRaceSpeed}</h5>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Keyboardpage />
    </React.Fragment>
  );
}

export default UserProfile;
