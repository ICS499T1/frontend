import React from "react";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { useEffect, useState, useRef } from 'react';
import { Box, Grid, TextField, Button, Typography, Card, CardContent } from "@mui/material";
import ProgressBar from "../ProgressBar/ProgressBar";
import WinnerCard from '../WinnerCard';
import InvitationButton from '../CopyInvitationButton';
import { CustomTextAlert, CustomBoolAlert } from '../Alerts/CustomAlert';
import { calculateLiveSpeed, calculateAccuracy, reinitializeConnection, handleKey, positionIndicator } from '../GameCommons';
import { useStyles } from '../../hooks/useGameStyles'
import GLOBAL from '../../resources/Global';

var socket = new SockJS(GLOBAL.API + '/new-player');
var stompClient = Stomp.over(socket);

const MultiGame = ({ gameId, create }) => {
  // Used to see if the player is the host or not
  const [created, setCreated] = useState(false);
  // Used to store player's session id
  const [sessionId, setSessionId] = useState("");
  // Used to store countdown seconds
  const [countdownSeconds, setCountdownSeconds] = useState(GLOBAL.COUNTDOWN_SECONDS);
  // Used to see if the countdown is in progress
  const [isCountdown, setIsCountdown] = useState(false);
  // Used for syncing client-side game status with server-side game status
  const [gameStatus, setGameStatus] = useState({
    gameText: [],
    status: '',
    players: null,
  });
  // Used to see if the start button was pressed
  const [startGameBool, setStartGameBool] = useState(false);
  // Used to process game events
  const [game, setGame] = useState({
      players: null,
      winner: null,
      startTime: 0,
  });
  // Used to set the amount of seconds before the disconnect
  const [disconnectSeconds, setDisconnectSeconds] = useState(GLOBAL.DISCONNECT_SECONDS);
  // Used to set game text once the game status is updated
  const [gameText, setGameText] = useState([]);
  // Used to recieve server errors
  const [serverError, setServerError] = useState('');
  // Used to set the error once the user made 5 or more mistakes while typing
  const [error, setError] = useState(false);
  // Used to set game players
  const [players, setPlayers] = useState(null);
  // Used to set disconnected status once the disconnect countdown is over
  const [disconnected, setDisconnected] = useState(false);
  // Used to disable start button upon clicking it
  const [startClicked, setStartClicked] = useState(false);
  // Used to track the number of connection attempts
  const connectionAttempts = useRef(GLOBAL.CONNECTION_ATTEMPTS);
  // Used to reinitialize connection at a specified interval
  const countdownTimer = useRef();
  // Used to disconnect the client once the time runs out
  const disconnectTimer = useRef();
  // Used for reconnection time interval attempts
  const connectTimer = useRef();
  // Used to track the position of the player locally
  const localPosition = useRef(0);
  // Used to set game status locally
  const localStatus = useRef("READY");
  // Used to keep track of typed characters
  const textField = useRef();
  // Used to count incorrect chars locally
  const incorrectCharCount = useRef(0);
  // Used for styling
  const classes = useStyles();
  
  /**
   * Sends countdown request once the start button is pressed and resets disconnect value.
   */
  const startGame = () => {
    if(!stompClient.connected) {
      return;
    }
    setStartClicked(true);
    stompClient.send("/app/timer/" + gameId + '/' + sessionId, {}, gameId);
    setDisconnectSeconds(GLOBAL.DISCONNECT_SECONDS);
  }

  /**
   * Handles each key typed by the player.
   * 
   * @param {*} event key pressed 
   */
  const handleKeyDown = event => {
    var link = '/gameplay/'
    if (localStatus.current !== "IN_PROGRESS" || !stompClient.connected) {
      event.preventDefault();
      return;
    }
    handleKey({event, link, incorrectCharCount, stompClient, gameText, localPosition, localStatus, textField, gameId, sessionId, setDisconnectSeconds, setError});
  }

  /**
   * Initializes the connection with the backend using websockets. If it is not established
   * on the first time, retries 3 times before stopping. Once it's over, clears the interval.
   */
  useEffect(() => {
    if (gameId) {
      connectTimer.current = setInterval(() => {
        if (!stompClient.connected && connectionAttempts.current > 0) {
          socket = new SockJS(GLOBAL.API + '/new-player');
          stompClient = Stomp.over(socket);
          var link = GLOBAL.MULTI;
          reinitializeConnection({gameId, link, stompClient, socket, setSessionId, setGame, setGameStatus, setServerError});
          connectionAttempts.current = connectionAttempts.current - 1;
        } else {
          clearInterval(connectTimer.current);
        }
      }, 1000)
    }

    return async () => {
      clearInterval(connectTimer.current);
    }
}, [gameId])


  /**
   * Count downs and disconnects a client if they are inactive for 90 seconds.
   */
  useEffect(() => {
    if (disconnectTimer.current) {
      clearInterval(disconnectTimer.current);
    }
    disconnectTimer.current = setInterval(() => {
      setDisconnectSeconds((prevSeconds) => {
        if (prevSeconds <= 0) {
          clearInterval(disconnectTimer.current);
          stompClient.disconnect();
          setDisconnected(true);
        } else if (localStatus.current === "READY" && gameStatus.status === "IN_PROGRESS") {
          return GLOBAL.DISCONNECT_SECONDS;
        } else if (!created && gameStatus.status === "READY") {
          return GLOBAL.DISCONNECT_SECONDS;
        } else {
          return prevSeconds - 1;
        }
      })
    }, 1000)
  }, [gameStatus.status, created])

  /**
   * Clears countdown and disconnect intervals and disconnects the client. Equivalent of
   * ComponentDidUnmount in React classes.
   */
  useEffect(() => {
    return async () => {
      clearInterval(disconnectTimer.current);
      clearInterval(countdownTimer.current);
      if (stompClient.connected) {
        stompClient.disconnect();
      }
    }
  }, [])

  /**
   * Resets start game button when game status changes to READY
   */
  useEffect(() => {
    if (gameStatus.status === "READY") {
      setStartClicked(false);
    } else {
      setStartClicked(true);
    }
  }, [gameStatus.status])

  /**
   * If the client that connected is the host, creates a game. Otherwise, allows the client
   * to join the game if it exists.
   */
  useEffect(() => {
      if (stompClient.connected && create) {
        stompClient.send("/app/create/" + gameId + '/' + sessionId, {}, JSON.stringify({'username': localStorage.getItem('username')}));
      }
      if (stompClient.connected && !create) {
          stompClient.send("/app/join/" + gameId + '/' + sessionId, {}, JSON.stringify({'username': localStorage.getItem('username')}));
      }
  }, [create, gameId, sessionId])

  /**
   * Checks if the game start button was pressed and the client is the host. If so, 
   * sends start request to the backend.
   */
  useEffect(() => {
    if (startGameBool && created) {
      stompClient.send("/app/start/" + gameId + '/' + sessionId, {}, gameId);
      setStartGameBool(false);
    } else if (startGameBool) {
      setStartGameBool(false);
    }
  }, [startGameBool, created, gameId, sessionId])

  /**
   * Sets the host, the array of the players of the game, and game text.
   */
  useEffect(() => {
    if (gameStatus.status === '') {
      return;
    }
    
    if (gameStatus.status === "WAITING_FOR_ANOTHER_PLAYER") {
      clearInterval(countdownTimer.current);
      setCountdownSeconds(GLOBAL.COUNTDOWN_SECONDS);
      setIsCountdown(false);
    } else if (gameStatus.status === "IN_PROGRESS") {
      textField.current.focus();
      localStatus.current = "IN_PROGRESS";
    }

    if (gameStatus.players && gameStatus.players[sessionId] && gameStatus.players[sessionId].playerNumber === 1) {
      setCreated(true);
    }

    const newPlayers = [];
    Object.keys(gameStatus.players).forEach( key => {
      const index = gameStatus.players[key].playerNumber;
      var player = ['', ''];
      player[0] = gameStatus.players[key].username;
      player[1] = key;
      newPlayers[index] = player;
    })
    
    setPlayers(newPlayers);
    // Set game text only when status updates
    setGameText(gameStatus.gameText);
  }, [gameStatus, create, gameId, sessionId, countdownSeconds])

  /**
   * Counts down seconds before the start.
   */
  useEffect(() => {    
    if (gameStatus.status === "COUNTDOWN") {
      textField.current.focus();
      clearInterval(countdownTimer.current);
      setIsCountdown(true);
      countdownTimer.current = setInterval(() => {
        setCountdownSeconds((prevSeconds) => {
          if (prevSeconds === 1) {
            setStartGameBool(true);
            return prevSeconds - 1;
          } else if (prevSeconds === 0) {
            clearInterval(countdownTimer.current);
            setIsCountdown(false);
            setCountdownSeconds(GLOBAL.COUNTDOWN_SECONDS);
          } else {
            return prevSeconds - 1;
          }
        });
      } ,  1000 );     
    }
  }, [gameStatus])

  /**
   * Sets created value to true if the player is the host.
   */
  useEffect(() => {
    setCreated(create);
  }, [create])

  /**
   * Highlights the game text that was typed by the player in blue if typed correctly
   * or in red if typed incorrectly.
   * 
   * @param idx - player's position 
   * @returns text style
   */
  const gameplayIndicator = (idx) => {
    if (game.players) {
      var player = game.players[sessionId];
      return positionIndicator({idx, gameStatus, player});
    }
  }

  /**
   * Underlines a player with a specific color.
   * 
   * @param idx - player number 
   * @returns player's style
   */
  const playerListIndicator = (idx) => {
    const returnVal = {};
    if (idx === 1) {
      returnVal['borderBottom'] = "5px solid red";
    } else if (idx === 2) {
      returnVal['borderBottom'] = "5px solid blue"; 
    } else if (idx === 3) {
      returnVal['borderBottom'] = "5px solid green";
    } else if (idx === 4) {
      returnVal['borderBottom'] = "5px solid brown";
    }
    return returnVal;
  }

  return (
      <React.Fragment>
          <Grid container className={classes.color} alignItems="center" justifyContent="center" direction="column" rowSpacing={3} padding='20px'>
            <Grid item>
              <CustomTextAlert inputText={serverError} severityType="error"/>
            </Grid>
            <Grid item padding="20px">
                <InvitationButton gameId={gameId} gameStatus={gameStatus} />
            </Grid>
            <Grid item>
              <CustomBoolAlert input={disconnected} severityType="error" text="You have been disconnected due to inactivity." />
            </Grid>
            {created && gameStatus.status === "READY" && <Typography sx={{textAlign: 'center'}} variant="h5" color="common.white">Click START GAME! to begin playing!</Typography>}
            {disconnectSeconds < 11 && <Typography sx={{textAlign: 'center'}} variant="h5" color="common.white">{"You will be disconnected in " + disconnectSeconds + " seconds due to inactivity."}</Typography>}
            <Grid item sx={{ width: '100%', display: 'flex', justifyContent: 'center'}}>
              <Card sx={{ maxWidth: 900, width: '100%' }}>
                <CardContent>
                  <Typography sx={{ width: '100%', minHeight: '1em', wordWrap: 'break-word', overflowWrap: 'break-word', whiteSpace: 'normal'}}>
                    {gameText.length ? (
                      gameText.map((char, idx) => {
                          return <span key={idx} style={gameplayIndicator(idx)}>{char}</span>;
                      })
                    ) : (
                      <span></span> // Placeholder for empty state
                    )}
                  </Typography>
                </CardContent>
            </Card>
            </Grid>
            <Grid item>
              <TextField placeholder="Start Typing Here"
                      inputProps={{ spellCheck: 'false' }}
                      inputRef={textField}
                      variant="outlined"
                      error={error}
                      helperText={error && "Fix Mistakes First!"}
                      style={{backgroundColor: "white"}}
                      onKeyDown={handleKeyDown}/> 
            </Grid>
            <Grid item>
              {gameStatus.status === "WAITING_FOR_ANOTHER_PLAYER" && <Typography sx={{textAlign: 'center'}} variant="h4" color="common.white">Waiting for another player!</Typography>}
              {!created && gameStatus.status === "READY" && <Typography sx={{textAlign: 'center'}} variant="h4" color="common.white">Please wait for the host to start the game!</Typography>}
            </Grid>
            <Grid item>
              {isCountdown && <Grid item><Typography className={classes.color} sx={{textAlign: 'center'}} variant="h4" color="common.white">{countdownSeconds ? countdownSeconds : "GO!"}</Typography></Grid>}
            </Grid>
            <Grid item padding='20px'>
              {created && stompClient.connected &&
              <Grid item>
                <Button variant="contained" 
                        disabled={startClicked} 
                        onClick={startGame}>Start Game!</Button>
              </Grid>}
              {!stompClient.connected &&
              <CustomTextAlert inputText={"Not connected"} severityType="info"/>}
            </Grid>
              {players && players.map((player, idx) => {
              if (player) {
                return (
                <Grid key={idx} container direction="row" columnSpacing={3} justifyContent="center" alignItems="center" padding="20px">
                  <Grid item>
                    <Typography sx={playerListIndicator(idx)} variant="p" color="common.white">{player[0]}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography color="common.white">Speed: {game.players && game.players[player[1]] && calculateLiveSpeed(game.players[player[1]], game.startTime)} </Typography>
                  </Grid>
                  <Grid item>
                    <Typography color="common.white">Accuracy: {game.players && game.players[player[1]] && calculateAccuracy(game.players[player[1]].failedCharacters.length, game.players[player[1]].position)} </Typography>
                  </Grid>
                  <Grid item>
                    <ProgressBar playerPosition={(game.players && game.players[player[1]] && gameStatus.status === "IN_PROGRESS") ? game.players[player[1]].position : 0} lastPosition={gameStatus.gameText ? gameStatus.gameText.length : 1} />
                  </Grid>
                </Grid>
                )
              }
              return (
              <Grid className={classes.color} key={idx} container sx={{padding: '5px'}} direction="row" columnSpacing={3} justifyContent="center" alignItems="center">

              </Grid>
              )
            })}
          </Grid>
          <Box mt={5}>
            {game.winner && 
            <WinnerCard 
            username={game.winner.username} 
            speed={calculateLiveSpeed(game.winner, game.startTime)}
            accuracy={calculateAccuracy(game.winner.failedCharacters.length, game.winner.position)}/>}
          </Box>
      </React.Fragment>
    );
  };

  export default MultiGame;
