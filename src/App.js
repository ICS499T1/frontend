import './App.css';
import React, { Component } from 'react';
import Users from './components/users';

class App extends Component {
    state = {
        users: []
    }

    componentDidMount() {
        fetch('http://localhost:8080/user/getusers')
        .then(res => res.json())
        .then((data) => {
        this.setState({ users: data })
        })
        .catch(console.log)
    }

    render() {
        return (
            <Users users={this.state.users} />
        )
    }
}

export default App;
