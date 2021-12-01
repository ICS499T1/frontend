import "./App.css";
import React, { Component } from "react";
import Login from "./pages/Login.js";
import Signup from "./pages/Signup.js";
import Body from "./pages/Body.js";
import Tutorials from "./components/Tutorial";
import AboutUs from "./pages/AboutUs";
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
  },
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#2E2F43',
          border: '1px solid #dadde9',
        },
        arrow: {
          color: '#f5f5f9',
        }
      },
    },
  }
});

class App extends Component {

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
              <Route path="/tutorials" component={Tutorials} />
              <Route path="/aboutus" component={AboutUs} />
              <ProtectedRoute path="/multiplayer/:gameId" component={MultiplayerJoin} />
              <ProtectedRoute path="/multiplayer" component={MultiplayerCreate} />
              <ProtectedRoute path="/singleplayer" component={SinglePlayerCreate} />
              <ProtectedRoute path="/myprofile" component={UserProfile} />
              <Route path="/aboutus" component={AboutUs} />
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
