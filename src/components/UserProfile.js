import React, { Component } from "react";
import Keyboardpage from "../components/Keyboard.js";
import "react-simple-keyboard/build/css/index.css";
import "./UserProfile.css";
import Box from "@mui/material/Box";
import Avatar from "../components/Avatar.js";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Link } from "@mui/material";
import BackgroundLetterAvatars from "../components/Avatar.js";
import { useEffect, useState, useRef } from "react";

function UserProfile() {
  const [user, setUser] = useState({
    userStats: null,
  });

  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchInit = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "gibjork", password: "gina123" }),
    };

    fetch("http://localhost:8080/user/info", fetchInit)
      .then((response) => response.json())
      .then((data) => {
        console.log("fetch: " + data);
        setUsername(data.username);
      });
  }, []);

  return (
    <React.Fragment>
      <Box class="bigbox">
        <div>
          <h1 class="title"> Hello, Welcome back!</h1>
        </div>
        <Box class="boxuser">
          <Card class="card">
            <CardContent class="cardcontent">
              <Grid container columnSpacing={5} rowSpacing={3}>
                <Grid item>
                  <div>
                    <Avatar />
                  </div>
                </Grid>
                <Grid item xs={12} sm container>
                  <Grid item>
                    <div>
                      <p>Username: {username} </p>
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
                  <h5 class="textstats">12</h5>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Card class="card">
                <CardContent class="cardcontent">
                  <p class="subtitles">Races Won</p>
                  <h5 class="textstats">50</h5>
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
                  <h5 class="textstats">3</h5>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Card class="card">
                <CardContent class="cardcontent">
                  <p class="subtitles">Highest Score</p>
                  <h5 class="textstats">169</h5>
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
