import "./App.css";
import React, { Component } from "react";
import Login from "./pages/Login.js";
import Signup from "./pages/Signup.js";
import Body from "./pages/Body.js";
import Terms from "./components/Terms";
import Tutorials from "./components/Tutorial";
import About from "./pages/About";
import Layout from './components/Layout'
import UserProfile from "./pages/UserProfile";
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material';
import { AuthenticationProvider } from "./hooks/useAuthentication";
import { AuthorizationProvider } from "./hooks/useAuthorization";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import MultiplayerJoin from "./pages/MultiplayerJoin";
import MultiplayerCreate from "./pages/MultiplayerCreate";
import SinglePlayerCreate from "./pages/SinglePlayerCreate.js";
import NotFound from "./pages/NotFound";

const theme = createTheme({
  palette: {
    primary: {
      main: '#2E2F43'
    }
  }
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
      <ThemeProvider theme={theme}>
      <Router>
        <AuthenticationProvider>
          <AuthorizationProvider>
            <Layout>
            <Switch>
              <Route path="/" exact component={Body} />
              <Route path="/login" component={Login} />
              <Route path="/signup" component={Signup} />
              <Route path="/termsandconditions" component={Terms} />
              <Route path="/tutorials" component={Tutorials} />
              <Route path="/about" component={About} />
              <ProtectedRoute path="/multiplayer/:gameId" component={MultiplayerJoin} />
              <ProtectedRoute path="/multiplayer" component={MultiplayerCreate} />
              <ProtectedRoute path="/singleplayer" component={SinglePlayerCreate} />
              <ProtectedRoute path="/myprofile" component={UserProfile} />
              <Route component={NotFound} />
            </Switch>
            </Layout>
          </AuthorizationProvider>
        </AuthenticationProvider>
      </Router>
      </ThemeProvider>
    );
  }
}
export default App;
