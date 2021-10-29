import "./App.css";
import React, { Component } from "react";
// import Body from "./components/Body";
// import Footer from "./components/Footer"
// import Users from "./components/users";
// import MenuBar from "./components/Menu";
import Menu from './components/Menu.js';
import Signin from "./components/Signin.js";
import Signup from "./components/Signup.js";
import Body from "./components/Body.js";
import Leaderboard from "./components/Leaderboard";
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';


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
      <Router>
        <div>
          <Menu />
          <Switch>
            <Route path="/" exact component={Body} />
            <Route path="/signin" component={Signin} />
            <Route path="/signup" component={Signup} />
            <Route path="/leaderboard" component={Leaderboard} />
          </Switch>
        </div>
      </Router>
    );
  }
}
export default App;
