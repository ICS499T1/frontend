import "./App.css";
import React, { Component } from "react";
import Body from "./components/Body";
import Users from "./components/users";
import MenuBar from "./components/Menu";

class App extends Component {
  // state = {
  //     users: []
  // }

  // componentDidMount() {
  //     fetch('http://localhost:8080/user/getusers')
  //     .then(res => res.json())
  //     .then((data) => {
  //     this.setState({ users: data })
  //     })
  //     .catch(console.log)
  // }

  render() {
    return (
      <React.Fragment>
        <MenuBar />
        <Body />
      </React.Fragment>
    );
  }
}

export default App;
