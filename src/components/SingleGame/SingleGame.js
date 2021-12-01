import React from "react";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { useEffect, useState, useRef } from 'react';
import { Grid, TextField, Button, Typography, Card, CardContent } from "@mui/material";
import ProgressBar from "../ProgressBar/ProgressBar";
import { CustomTextAlert, CustomBoolAlert } from '../Alerts/CustomAlert';
import { calculateLiveSpeed, calculateAccuracy, reinitializeConnection, handleKey, positionIndicator } from '../GameCommons';
import GLOBAL from '../../resources/Global';
import { useStyles } from '../../hooks/useGameStyles'

var socket = new SockJS(GLOBAL.API + '/new-player');
var stompClient = Stomp.over(socket);

const SingleGame = ({ gameId }) => {
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
    player: null
  });
  // Used to process game events
  const [game, setGame] = useState({
      player: null
  });
  // Used to set the amount of seconds before the disconnect
  const [disconnectSeconds, setDisconnectSeconds] = useState(GLOBAL.DISCONNECT_SECONDS);
  // Used to set game text once the game status is updated
  const [gameText, setGameText] = useState([]);
  // Used to see if the start button was pressed
  const [startGameBool, setStartGameBool] = useState(false);
   // Used to set disconnected status once the disconnect countdown is over
  const [disconnected, setDisconnected] = useState(false);
  // Used to recieve server errors
  const [serverError, setServerError] = useState('');
  // Used to set the error once the user made 5 or more mistakes while typing
  const [error, setError] = useState(false);
   // Used to reinitialize connection at a specified interval
  const countdownTimer = useRef();
  // Used for reconnection time interval attempts
  const connectTimer = useRef();
  // Used to track the position of the player locally
  const localPosition = useRef(0);
  // Used to set game status locally
  const localStatus = useRef("READY");
  // Used to count incorrect chars locally
  const incorrectCharCount = useRef(0);
  // Used to keep track of typed characters
  const textField = useRef();
  // Used to disconnect the client once the time runs out
  const disconnectTimer = useRef();
  // Used for styling
  const classes = useStyles();

  /**
   * Starts the countdown after start button is clicked.
   */
  const startGame = () => {
      if (!stompClient.connected) {
        return;
      }
      setDisconnectSeconds(GLOBAL.DISCONNECT_SECONDS);
      if (localStatus.current === "READY") {
          stompClient.send("/app/timer/single/" + gameId + '/' + sessionId, {}, gameId);
      }
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
      textField.current.focus();
  }

  /**
   * Handles each key typed by the player.
   * 
   * @param {*} event key pressed 
   */
  const handleKeyDown = event => {
      var link = '/gameplay/single'
      if (localStatus.current === "READY" || !stompClient.connected) {
        event.preventDefault();
        return;
      }
      handleKey({event, link, incorrectCharCount, stompClient, gameText, localPosition, localStatus, textField, gameId, sessionId, setDisconnectSeconds, setError});
  }

  /**
   * Sends start game request to the back-end.
   */
  useEffect(() => {
    if (startGameBool) {
      stompClient.send("/app/start/single/" + gameId + '/' + sessionId, {}, gameId);
      setStartGameBool(false);
    }
  }, [startGameBool, gameId, sessionId])
  
  /**
   * Initializes the connection with the backend using websockets. If it is not established
   * on the first time, retries 3 times before stopping. Once it's over, clears the interval.
   */
  useEffect(() => {
      if (gameId) {
        connectTimer.current = setInterval(() => {
          if (!stompClient.connected) {
            socket = new SockJS(GLOBAL.API + '/new-player');
            stompClient = Stomp.over(socket);
            var link = GLOBAL.SINGLE;
            reinitializeConnection({gameId, link, stompClient, socket, setSessionId, setGame, setGameStatus, setServerError});
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
   * Creates a game for the user if the websockets are properly connected.
   */
  useEffect(() => {
      if (stompClient.connected) {
        stompClient.send("/app/create/single/" + gameId + '/' + sessionId, {}, JSON.stringify({'username': localStorage.getItem('username')}));
      }
  }, [gameId, sessionId])

  /**
   * Sets local status to in progress if the game status is set to in progress.
   */
  useEffect(() => {
    if (gameStatus.status === "IN_PROGRESS") {
      localStatus.current = "IN_PROGRESS";
    }
    setGameText(gameStatus.gameText);
  }, [gameStatus])

  /**
   * Count downs and disconnects a client if they are inactive for 90 seconds.
   */
  useEffect(() => {
    disconnectTimer.current = setInterval(() => {
      setDisconnectSeconds((prevSeconds) => {
        if (prevSeconds <= 0) {
          clearInterval(disconnectTimer.current);
          stompClient.disconnect();
          setDisconnected(true);
        } else {
          return prevSeconds - 1;
        }
      })
    }, 1000)
    return async () => {
      clearInterval(disconnectTimer.current);
      clearInterval(countdownTimer.current);
      if (stompClient.connected) {
        stompClient.disconnect();
      }
    }
  }, [])

  /**
   * Highlights the game text that was typed by the player in blue if typed correctly
   * or in red if typed incorrectly.
   * 
   * @param idx - player's position 
   * @returns text style
   */
  const gameplayIndicator = (idx) => {
    var player = game.player;
    return positionIndicator({idx, gameStatus, player});
  }

  return (
      <React.Fragment>
          <Grid item>
            <CustomTextAlert inputText={serverError} severityType="error"/>
          </Grid>
          <Grid item>
            <CustomBoolAlert input={disconnected} severityType="error" text="You have been disconnected due to inactivity." />
          </Grid>
          <Grid container className={classes.color} alignItems="center" justifyContent="center" direction="column" rowSpacing={3} padding='20px'>
            {gameStatus.status && gameStatus.status === "READY" && !isCountdown && <Typography sx={{textAlign: 'center'}} variant="h5" color="common.white">Click START GAME! to begin playing!</Typography>}
            {disconnectSeconds < 11 && <Typography variant="h5" className={classes.color} sx={{textAlign: 'center'}} color="common.white">{"You will be disconnected in " + disconnectSeconds + " seconds due to inactivity."}</Typography>}
            <Grid item>
            <Card sx={{ maxWidth: 900 }}>
                <CardContent>                   
                    {gameText && 
                    <Typography 
                    sx={{minWidth:'80vh'}}
                    >
                      {gameText.map((char, idx) => {
                          return <span key={idx} style={gameplayIndicator(idx)}>{char}</span>;
                      })}
                  </Typography>}
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
              {isCountdown && <Typography sx={{textAlign: 'center'}} variant="h4" color="common.white">{countdownSeconds ? countdownSeconds : "GO!"}</Typography>}
              {stompClient.connected ? 
                <Grid item>
                  <Button variant="contained" disabled={gameStatus.status === "IN_PROGRESS" || gameStatus.status === ''} onClick={startGame}>
                    Start Game!
                  </Button>
                </Grid> : 
                <CustomTextAlert inputText={"Not connected"} severityType="error"/>}
            </Grid>
          {game.player && 
          <Grid container sx={{padding: '10px'}} direction="row" columnSpacing={3} justifyContent="center" alignItems="center">
            <Grid item>
              <Typography variant="p" color="common.white">{game.player.username}</Typography>
            </Grid>
            <Grid item>
              <Typography color="common.white">Speed: {game.player && calculateLiveSpeed(game.player, game.startTime)} </Typography>
            </Grid>
            <Grid item>
              <Typography color="common.white">Accuracy: {game.player && calculateAccuracy(game.player.failedCharacters.length, game.player.position)} </Typography>
            </Grid>
            <Grid item>
              <ProgressBar playerPosition={gameStatus.status === "IN_PROGRESS" ? game.player.position : 0} lastPosition={gameStatus.gameText.length} />
            </Grid>
          </Grid>
          }
          </Grid>
      </React.Fragment>
    );
  };

  export default SingleGame;