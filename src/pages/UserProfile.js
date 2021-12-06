import React from "react";
import "./UserProfile.css";
import BackgroundLetterAvatars from "../components/Avatar.js";
import { useEffect, useState } from "react";
import { useAuthorization } from '../hooks/useAuthorization';
import Background from "../components/Background";
import Backimage from "../images/astronaut-aesth2.jpeg";
import KeyboardLayout from "../components/KeyboardLayout/KeyboardLayout";
import { Grid, Box, Card, CardContent, Typography } from "@mui/material";

function UserProfile() {
  let { instance } = useAuthorization(); 

  const [user, setUser] = useState({
    username: '',
    userStats: {averageSpeed: 0, numSingleGamesCompleted: 0, numMultiGamesCompleted: 0, racesWon: 0, bestRaceSpeed: 0, lastRaceSpeed: 0, accuracy: 0},
    allKeys: {}
  });

  useEffect(() => {
    const getUser = async () => {
        const data = await instance.post(`/user/getuser?username=${localStorage.getItem("username")}`).then(
        result => result.data);
        if (data) {
          // calculate accuracy percentage and store in a dictionary, access each character's accuracy by the character itself
          let keyDict = Object.assign({}, ...data.allKeys.map((x) => ({[x.character]: (x.numSuccesses/(x.numFails + x.numSuccesses) * 100).toFixed(2)})));
          setUser({username: data.username,
                   userStats: {
                   averageSpeed: data.userStats.averageSpeed,
                   numSingleGamesCompleted: data.userStats.numSingleGamesCompleted,
                   numMultiGamesCompleted: data.userStats.numMultiGamesCompleted,
                   racesWon: data.userStats.racesWon,
                   bestRaceSpeed: data.userStats.bestRaceSpeed,
                   lastRaceSpeed: data.userStats.lastRaceSpeed,
                   accuracy: data.userStats.accuracy
                 },
                   allKeys: keyDict
                });
        }
    }
    getUser();
  }, [instance]);

  return (
    <React.Fragment>
      <Background imgPath={Backimage}>
          {/* <Typography sx={{textAlign: 'center'}} variant="h4" color="common.white">Welcome back, {user.username}!</Typography> */}
          <h1 className="title"> Welcome back, {user.username}!</h1>
        <Box className="boxuser">
          <Card className="card">
            <CardContent className="cardcontent">
              <Grid container columnSpacing={5} rowSpacing={3}>
                <Grid item>
                  <div>
                    {BackgroundLetterAvatars(user.username)}
                  </div>
                </Grid>
                <Grid item xs={12} sm container>
                  <Grid item>
                    <div>
                      <p className="subtitles">Username: {user.username} </p>
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
                  <p className="subtitles">Overall Accuracy</p>
                  <h5 className="textstats">{user.userStats.accuracy}%</h5>
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
                  <p className="subtitles">Fastest Speed</p>
                  <h5 className="textstats">{user.userStats.bestRaceSpeed}</h5>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Card className="card">
                <CardContent className="cardcontent">
                  <p className="subtitles">Last Recorded Speed</p>
                  <h5 className="textstats">{user.userStats.lastRaceSpeed}</h5>
                </CardContent>
              </Card>
            </Grid>
          </Grid>              
        </Box>

        {/* Stats display row 3 */}
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
                  <p className="subtitles">Practice Games Played</p>
                  <h5 className="textstats">{user.userStats.numSingleGamesCompleted}</h5>
                </CardContent>
              </Card>
            </Grid>
          </Grid>              
        </Box>

              {/* Stats display row 4 */}
              <Box className="boxstats">
          <Grid container columnSpacing={5} rowSpacing={4} justify="flex-start">
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Card className="card">
                <CardContent className="cardcontent">
                  <p className="subtitles">Races Won</p>
                  <h5 className="textstats">{user.userStats.racesWon}</h5>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Card className="card">
                <CardContent className="cardcontent">
                  <p className="subtitles">Races Lost</p>
                  <h5 className="textstats">{user.userStats.numMultiGamesCompleted - user.userStats.racesWon}</h5>
                </CardContent>
              </Card>
            </Grid>
          </Grid>              
        </Box>
    </Background>
    <Background imgPath={Backimage}>
      <Box className="boxkeyboard">
          <Card className="card">
            <CardContent className="cardcontent">
              <Grid container columnSpacing={5} rowSpacing={3}>
                <Grid item xs={12} sm container>
                  <Grid item>
                    <div>
                      <Typography variant="h4" color="common.white">Hover over a key below to see your stats for that key!</Typography>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
        <Box className="boxkeyboard">
            <KeyboardLayout user={user} />
        </Box>
        
    </Background>
    </React.Fragment>
  );
}

export default UserProfile;
