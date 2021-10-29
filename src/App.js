import React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom'
import Layout from './components/Layout'
import Home from './components/Home'
import Login from './components/Login'
// import Home from './components/Home'
import AboutUs from './components/AboutUs'

import './App.css';

function App() {
    return (
        <div className="body-wrap">
            <Router>
                <Layout>
                    <Switch>
                        <Route path={'/login'} component={Login}></Route>
                        <Route path={'/aboutUs'} component={AboutUs}></Route>
                        <Route path={'/'} component={Home}></Route>
                    </Switch>
                </Layout>
            </Router>
        </div>
    );
}

export default App;
