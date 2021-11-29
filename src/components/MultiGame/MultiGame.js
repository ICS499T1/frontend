import React from "react";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { useEffect, useState, useRef } from 'react';
import { Grid, TextField, Button, Typography, Card, CardContent, Collapse, Alert, IconButton } from "@mui/material";
import ProgressBar from "../ProgressBar/ProgressBar";
import CloseIcon from '@mui/icons-material/Close';
import { CustomTextAlert, CustomBoolAlert } from '../Alerts/CustomAlert';
import { calculateLiveSpeed, calculateSpeed, calculateAccuracy, reinitializeConnection, handleKey, positionIndicator } from '../GameCommons';
import { useStyles } from '../../hooks/useGameStyles'
import GLOBAL from '../../resources/Global';

var socket = new SockJS(GLOBAL.API + '/new-player');
var stompClient = Stomp.over(socket);

const MultiGame = ({ gameId, create }) => {
    const [created, setCreated] = useState(false);
    const [sessionId, setSessionId] = useState("");
    const [countdownSeconds, setCountdownSeconds] = useState(GLOBAL.COUNTDOWN_SECONDS);
    const [isCountdown, setIsCountdown] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);
    const connectTimer = useRef();
    const [gameStatus, setGameStatus] = useState({
      gameText: [],
      status: '',
      players: null,
    });
    const [startGameBool, setStartGameBool] = useState(false);
    const [game, setGame] = useState({
        players: null,
        winner: null,
        startTime: 0,
    });
    const [disconnectSeconds, setDisconnectSeconds] = useState(GLOBAL.DISCONNECT_SECONDS);
    const [gameText, setGameText] = useState([]);
    const [serverError, setServerError] = useState('');
    const [error, setError] = useState(false);
    const [players, setPlayers] = useState(null);
    const [disconnected, setDisconnected] = useState(false);
    const connectionAttempts = useRef(GLOBAL.CONNECTION_ATTEMPTS);
    const countdownTimer = useRef();
    const disconnectTimer = useRef();
    const localPosition = useRef(0);
    const localStatus = useRef("READY");
    const textField = useRef();
    const incorrectCharCount = useRef(0);
   
    const startGame = () => {
      if(!stompClient.connected) {
        return;
      }
      stompClient.send("/app/timer/" + gameId + '/' + sessionId, {}, gameId);
      setDisconnectSeconds(GLOBAL.DISCONNECT_SECONDS);
      textField.current.focus();
    }
    const classes = useStyles();

    const handleKeyDown = event => {
      var link = '/gameplay/'
      if (localStatus.current !== "IN_PROGRESS" || !stompClient.connected) {
        event.preventDefault();
        return;
      }
      handleKey({event, link, incorrectCharCount, stompClient, gameText, localPosition, localStatus, textField, gameId, sessionId, setDisconnectSeconds, setError});
    }

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

    // Used to maintain the countdown for the disconnect timer
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

    useEffect(() => {
      return async () => {
        clearInterval(disconnectTimer.current);
        clearInterval(countdownTimer.current);
        if (stompClient.connected) {
          stompClient.disconnect();
        }
      }
    }, [])

    useEffect(() => {
        if (stompClient.connected && create) {
          stompClient.send("/app/create/" + gameId + '/' + sessionId, {}, JSON.stringify({'username': localStorage.getItem('username')}));
        }
        if (stompClient.connected && !create) {
            stompClient.send("/app/join/" + gameId + '/' + sessionId, {}, JSON.stringify({'username': localStorage.getItem('username')}));
        }
    }, [create, gameId, sessionId])

    useEffect(() => {
      if (startGameBool && created) {
        stompClient.send("/app/start/" + gameId + '/' + sessionId, {}, gameId);
        setStartGameBool(false);
      } else if (startGameBool) {
        setStartGameBool(false);
      }
    }, [startGameBool, created, gameId, sessionId])

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

    useEffect(() => {
      // Used for countdown      
      if (gameStatus.status === "COUNTDOWN") {
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

    useEffect(() => {
      setCreated(create);
    }, [create])

    const gameplayIndicator = (idx) => {
      // TODO uncomment to make text unselectable
      if (game.players) {
        var player = game.players[sessionId];
        return positionIndicator({idx, gameStatus, player});
      }
    }

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
            <Grid item>
              <CustomTextAlert inputText={serverError} severityType="error"/>
            </Grid>
            <Grid item>
              <Collapse in={linkCopied}>
                <Alert
                  severity="success"
                  action={
                  <IconButton
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setLinkCopied(false);
                    }}
                  >
                  <CloseIcon fontSize="inherit" />
                  </IconButton>
                  }
                sx={{ mb: 2 }}>
                  {"Link copied!"}
                </Alert>
              </Collapse>
            </Grid>
            <Grid item>
            <CustomBoolAlert input={disconnected} severityType="error" text="You have been disconnected due to inactivity." />
            </Grid>
            <Grid item>
              {(gameStatus.status !== "IN_PROGRESS" && gameStatus.status !== "COUNTDOWN") &&
              <Button sx={{cursor: 'pointer'}} 
                          onClick={() => {
                            navigator.clipboard.writeText(GLOBAL.DOMAIN + '/multiplayer/' + gameId);
                            setLinkCopied(true);
                          }} 
                          variant="contained" 
                          size="large"
              >
                Click to copy invitation
              </Button>}
            </Grid>
            <Grid item>
            {created && gameStatus.status === "READY" && <Typography className={classes.color} sx={{textAlign: 'center'}} variant="h5" color="common.white">Click START GAME! to begin playing!</Typography>}
            {disconnectSeconds < 11 && <Typography className={classes.color} sx={{textAlign: 'center'}} variant="h5" color="common.white">{"You will be disconnected in " + disconnectSeconds + " seconds due to inactivity."}</Typography>}
            <Card sx={{ maxWidth: 700 }}>
                <CardContent>                    
                    {gameText && 
                    <Typography>
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
            <Grid item padding='20px'>
              {isCountdown && <Grid item><Typography className={classes.color} sx={{textAlign: 'center'}} variant="h4" color="common.white">{countdownSeconds ? countdownSeconds : "GO!"}</Typography></Grid>}
              {created && stompClient.connected &&
              <Grid item>
                <Button variant="contained" 
                        disabled={gameStatus.status !== "READY"} 
                        onClick={startGame}>Start Game!</Button>
              </Grid>}
              {!stompClient.connected &&
              <CustomTextAlert inputText={"Not connected"} severityType="info"/>}
              {gameStatus.status === "WAITING_FOR_ANOTHER_PLAYER" && <Typography className={classes.color} sx={{textAlign: 'center'}} variant="h4" color="common.white">Waiting for another player!</Typography>}
              {!created && gameStatus.status === "READY" && <Typography className={classes.color} sx={{textAlign: 'center'}} variant="h4" color="common.white">Please wait for the host to start the game!</Typography>}
            </Grid>
            {players && players.map((player, idx) => {
              if (player) {
                return (
                <Grid className={classes.color} key={idx} container sx={{padding: '10px'}} direction="row" columnSpacing={3} justifyContent="center" alignItems="center">
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
            <Card>
              {game.winner && 
              <Grid item className={classes.color}>
                <Typography sx={{textAlign: 'center'}} variant="h4" color="common.white">{"Winner: " + game.winner.username}</Typography>
                <Typography sx={{textAlign: 'center'}} variant="p" color="common.white">{"Speed: " + calculateSpeed(game.winner.endTime, game.startTime, game.winner.position)} </Typography>
                <Typography sx={{textAlign: 'center'}} variant="p" color="common.white">{"Accuracy: " + calculateAccuracy(game.winner.failedCharacters.length, game.winner.position)}</Typography>
              </Grid>}
            </Card>
        </React.Fragment>
    );
  };

  export default MultiGame;