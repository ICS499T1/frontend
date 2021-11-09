
import React, { Component } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import "./UserProfile.css";
import Box from "@mui/material/Box";
import Avatar from "../components/Avatar.js";
import Grid from "@mui/material/Grid";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Link } from "@mui/material";

class UserProfile extends React.Component {
  state = {
    layoutName: "default",
    input: ""
  };

  onChange = input => {
    this.setState({ input });
    console.log("Input changed", input);
  };

  onKeyPress = button => {
    console.log("Button pressed", button);

    /**
     * to handle the shift and caps lock buttons
     */
    if (button === "{shift}" || button === "{lock}") this.handleShift();
  };

  handleShift = () => {
    const layoutName = this.state.layoutName;

    this.setState({
      layoutName: layoutName === "default" ? "shift" : "default"
    });
  };

  onChangeInput = event => {
    const input = event.target.value;
    this.setState({ input });
    this.keyboard.setInput(input);
  };



  

  render() {
    return (
      <React.Fragment>
      <Box class="bigbox">
      <div>
        <h1 class="title"> Hello, Welcome back!</h1>
      </div>
      <Box class="boxuser">
        <Card class="card">
        <CardContent class="cardcontent">
          <Grid container columnSpacing={5} rowSpacing={3} >
            <Grid item>
            <div>
              <Avatar />
            </div>
            </Grid>
            <Grid item xs={12} sm container>
              <Grid item>
                <div>
                  <p>Username:</p>
                  <Link>Edit Profile</Link>
                </div>
              </Grid>
            </Grid>
          </Grid>
          </CardContent>
          </Card>
      </Box> 

      {/* Stats display row 1 */}
      <Box class="boxstats" >
          <Grid container columnSpacing={5} rowSpacing={4} justify="flex-start">
            <Grid item xs={12} sm={12} md={6} lg={6}>
            <Card class="card">
                <CardContent class="cardcontent">
                  <p class="subtitles">Average Speed</p>
                  <h5 class="textstats">12 sec</h5>
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
      <Box class="boxstats" >
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


      {/* Keyboard */}
      <div>
        <Box class="boxkeyboard">
          <Box class="boxuser">
            <Card class="cardtwo">
              <CardContent class="cardcontenttwo">
                <p class="textone">TEST YOUR KEYBOARD BEFORE PLAYING</p>
                  {/* <input 
                    value={this.state.input}
                    placeholder={"Tap on the virtual keyboard to start"}
                    onChange={this.onChangeInput}
                  
                  /> */}
                
              <Keyboard
                  keyboardRef={r => (this.keyboard = r)}
                  layoutName={this.state.layoutName}
                  onChange={this.onChange}
                  onKeyPress={this.onKeyPress}
                />
              </CardContent>
            </Card>
          </Box>
        </Box>
      </div>
      </React.Fragment>
    );
  }
}


export default UserProfile;