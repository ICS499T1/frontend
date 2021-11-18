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
import { useAuthorization } from '../hooks/useAuthorization';

function UserProfile() {

  let history = useHistory();
  let { instance } = useAuthorization(); 

  const statusCode = useRef(null);

  const [user, setUser] = useState({
    username: null,
    userStats: {averageSpeed: null, racesWon: null, bestRaceSpeed: null, numMultiGamesCompleted: null}
  });

  const arrowFunction = async () => {
    try {
      const resp = await instance.post(`/user/getuser?username=${localStorage.getItem("username")}`).then(
      result => result);
      console.log("Reponse: ", resp)
      console.log("Data: ", resp.data)
      return resp;
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    arrowFunction().then(result => result.data).then(data => 
      setUser({username:data.username,
          userStats: {averageSpeed: data.userStats.averageSpeed, racesWon: data.userStats.racesWon, 
          numMultiGamesCompleted: data.userStats.numMultiGamesCompleted, bestRaceSpeed: data.userStats.bestRaceSpeed
          }
        })
      ).catch(err => console.log(err));
  }, []);

  return (
    <React.Fragment>
      <Box className="bigbox">
        <div>
          <h1 className="title"> Welcome back, {user.username}!</h1>
        </div>
        <Box className="boxuser">
          <Card className="card">
            <CardContent className="cardcontent">
              <Grid container columnSpacing={5} rowSpacing={3}>
                <Grid item>
                  <div>
                    {BackgroundLetterAvatars(JSON.stringify(user.username))}
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
        <Box className="boxstats">
          <Grid container columnSpacing={5} rowSpacing={4} justify="flex-start">
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Card className="card">
                <CardContent className="cardcontent">
                  <p className="subtitles">Average Speed</p>
                  <h5 className="textstats">{user.userStats.averageSpeed}</h5>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Card className="card">
                <CardContent className="cardcontent">
                  <p className="subtitles">Races Won</p>
                  <h5 className="textstats">{user.userStats.racesWon}</h5>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Stats display row 2 */}
        <Box className="boxstats">
          <Grid container columnSpacing={5} rowSpacing={4} justify="flex-start">
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Card className="card">
                <CardContent className="cardcontent">
                  <p className="subtitles">Races Played</p>
                  <h5 className="textstats">{user.userStats.numMultiGamesCompleted}</h5>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Card className="card">
                <CardContent className="cardcontent">
                  <p className="subtitles">Highest Score</p>
                  <h5 className="textstats">{user.userStats.bestRaceSpeed}</h5>
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
