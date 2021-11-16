import "./App.css";
import React, { Component } from "react";
import Login from "./pages/Login.js";
import Signup from "./pages/Signup.js";
import Body from "./pages/Body.js";
import Leaderboard from "./components/Leaderboard";
import Terms from "./components/Terms";
import Tutorials from "./components/Tutorial";
import About from "./components/About";
import Layout from './components/Layout'
import UserProfile from "./components/UserProfile";
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

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
      <ThemeProvider theme={darkTheme}>
      <Router>
          <Layout>
          <Switch>
            <Route path="/" exact component={Body} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route path="/leaderboard" component={Leaderboard} />
            <Route path="/termsandconditions" component={Terms} />
            <Route path="/tutorials" component={Tutorials} />
            <Route path="/aboutus" component={About} />
            <Route path="/myprofile" component={UserProfile} />
          </Switch>
          </Layout>
      </Router>
      </ThemeProvider>
    );
  }
}
export default App;
