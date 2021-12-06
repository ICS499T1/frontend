import React, { Component } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import "../pages/UserProfile.css";
import Box from "@mui/material/Box";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

class Keyboardcomp extends Component {
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

      {/* Keyboard */}

        {/* <Box className="boxkeyboard"> */}
          <Box className="boxuser">
            <Card className="cardtwo">
              <CardContent className="cardcontenttwo">
                <p className="textone">TEST YOUR KEYBOARD BEFORE PLAYING</p>
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
        {/* </Box> */}

      </React.Fragment>
    );
  }
}

export default Keyboardcomp;