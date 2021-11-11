import React from 'react';
import PropTypes from 'prop-types';
import BackgroundLetterAvatars from '../components/Avatar.js'
import './Leaderboard.css'

class Leaderboard extends React.Component {
    constructor() {
      super();
      this.state = {
        list: []
      }
    }
  
    componentDidMount() {
      const fetchInit = {
        method: 'GET',
        mode: 'cors'
      };
  
      fetch('http://localhost:8080/leaderboard', fetchInit)
        .then(response => response.json())
        .then(data => {
          this.setState({
            list: data
          });
        })
        .catch(err => console.log('fetching error : ', err))
    }
  
    render() {
      let userlist = this.state.list.map((user, i) => <User username={ user.username } rank={ i + 1 } avatar={BackgroundLetterAvatars(user.username)} averageSpeed={ user.userStats.averageSpeed } />);
  
      return (
        <div className="container">
          <LeaderboardHeader />
          <ColumnHeader />
          { userlist }
        </div>
      )
    }
  }
  
  const LeaderboardHeader = () => {
    return (
      <div className="leadheader">
          <h2>Leaderboard</h2>
      </div>
    )
  }
  
  const ColumnHeader = () => {
      return (
        <div className="rows">
            <span>
                <h4>#</h4>
            </span>
            <span>
                <h4>Username</h4>
            </span>
            <span>
                <h4>Average Speed</h4>
            </span>
        </div>
        )
  };
  
  const User = ({ rank, avatar, username, averageSpeed, }) => {
    return (
        <div className="rows">
            <span>
                <h4>{ rank }</h4>
            </span>
            <span>
                <h4> { username } </h4>
            </span>
            <span>
                <h4> { averageSpeed } </h4>
            </span>
        </div>
    )
  }
  
  User.propTypes = {
    rank: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    averageSpeed: PropTypes.number.isRequired
  }
  
  export default Leaderboard;