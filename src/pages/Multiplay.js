import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import "./Soloplay.css";
import Box from "@mui/material/Box";
import background from "../images/multiplayerbackground.png";
import Button from "@material-ui/core/Button";
import Grid from "@mui/material/Grid";
import { alpha, styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Countdown from "../components/Countdown.js";
import { useAuthentication } from '../hooks/useAuthentication';

const styles = {
  paperContainer: {
    backgroundImage: `url(${background})`,
  },
};

// Input Field Styles
const CssTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "green",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "green",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "red",
    },
    "&:hover fieldset": {
      borderColor: "yellow",
    },
    "&.Mui-focused fieldset": {
      borderColor: "green",
    },
  },
});

const MuInput = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.mode === "light" ? "#fcfcfb" : "#2b2b2b",
    border: "1px solid #ced4da",
    fontSize: 16,
    width: "800px",
    padding: "10px 12px",
    overflow: "hidden",
    transition: theme.transitions.create([
      "border-color",
      "background-color",
      "box-shadow",
    ]),
    "&:focus": {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
  },
}));

class Multiplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = { disabled: true };
  }
  handleGameClik() {
    this.setState({ disabled: !this.state.disabled });
  }

  render() {
    return (
      <React.Fragment>
        <backgroundpage>
          <div style={styles.paperContainer}>
            <Box class="boxgame">
              <h1>Multiplayer Game</h1>
              <p>You are in a multi-player race</p>
              <h4>The race is on! Type the text below:</h4>

              <Grid
                container
                direction="column"
                alignItems="center"
                justify="center"
                paddingRight="10px"
                paddingLeft="10px"
                position="relative"
              >
                <Card class="cardtext">
                  <Card class="cardTwo">
                    <p class="paragraph">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Proin vel pellentesque purus, eu lacinia ante. Curabitur
                      sed magna vel elit mattis elementum. Duis id pulvinar
                      magna. Nam blandit odio risus, sed laoreet tortor lacinia
                      ac. Ut viverra metus et semper pretium. Vestibulum ante
                      ipsum primis in faucibus orci luctus et ultrices posuere
                      cubilia curae; Nulla quis iaculis nunc, ut egestas erat.
                      Fusce varius nisi et felis laoreet gravida facilisis ut
                      elit. Aliquam convallis risus et nulla commodo, ut luctus
                      orci scelerisque. Donec et semper augue, sit amet pulvinar
                      metus. Interdum et malesuada fames ac ante ipsum primis in
                      faucibus. Donec nibh velit, condimentum in vehicula at,
                      vehicula sed odio.
                    </p>
                    <FormControl variant="standard">
                      <InputLabel shrink htmlFor="bootstrap-input"></InputLabel>
                      <MuInput
                        disabled={this.state.disabled ? "disabled" : ""}
                        placeholder="Enter text here"
                        id="bootstrap-input"
                        multiline
                        rows={5}
                      />
                    </FormControl>
                  </Card>
                </Card>
              </Grid>

              {this.state.disabled ? (
                <Card class="buttoncard">
                  <Button
                    onClick={this.handleGameClik.bind(this)}
                    class="startbutton"
                  >
                    Start Game!
                  </Button>
                </Card>
              ) : (
                <p>
                  <Countdown />
                </p>
              )}
            </Box>
            <Card class="cardPlayers">

            </Card>
          </div>
        </backgroundpage>
      </React.Fragment>
    );
  }
}

export default Multiplay;
