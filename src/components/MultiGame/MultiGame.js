import React from "react";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { useEffect, useState, useRef } from 'react';
import { Grid, TextField, Button, Typography, Card, CardContent, Collapse, Alert, IconButton } from "@mui/material";
import ProgressBar from "../ProgressBar/ProgressBar";
import { makeStyles } from "@material-ui/core";
import CloseIcon from '@mui/icons-material/Close';
import { CustomTextAlert, CustomBoolAlert } from '../Alerts/CustomAlert';
import GLOBAL from '../../resources/Global';

var socket = new SockJS(GLOBAL.API + '/new-player');
var stompClient = Stomp.over(socket);

const useStyles = makeStyles(theme => ({
  color: {
    backgroundColor: 'rgba(46, 47, 67, 0.9)',
    borderRadius: "8px"
    }
}));

const MultiGame = ({ gameId, create }) => {
    const [created, setCreated] = useState(false);
    const [sessionId, setSessionId] = useState("");
    const [seconds, setSeconds] = useState(5);
    const [isCountdown, setIsCountdown] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);
    const connectTimer = useRef();
    const [gameStatus, setGameStatus] = useState({
      gameText: [],
      status: '',
      players: null
    });
    const [startGameBool, setStartGameBool] = useState(false);
    const [game, setGame] = useState({
        players: null,
        winner: null
    });
    const [disconnectSeconds, setDisconnectSeconds] = useState(90);
    const [localStatus, setLocalStatus] = useState('READY');
    const [gameText, setGameText] = useState([]);
    const [textField, setTextField] = useState('');
    const [serverError, setServerError] = useState('');
    const [error, setError] = useState(false);
    const [players, setPlayers] = useState(null);
    const [localPosition, setLocalPosition] = useState(0);
    const [incorrectCharCount, setIncorrectCharCount] = useState(0);
    const [disconnected, setDisconnected] = useState(false);
    const backspace = JSON.stringify('\b');
    const countdownTimer = useRef();
    const firstRender = useRef(true);
    const disconnectTimer = useRef();
   

    const startGame = () => {
        if (!stompClient.connected) {
          alert("Not connected yet");
          return;
        }
        stompClient.send("/app/timer/" + gameId + '/' + sessionId, {}, gameId);
        setDisconnectSeconds(90);
    }
    const classes = useStyles();

    const handleKeyDown = event => {
      if (localStatus !== "IN_PROGRESS" || !stompClient.connected) {
        event.preventDefault();
        return;
      }
      setDisconnectSeconds(90);
      var key = event.key;
      var keyCode = event.keyCode;

      if (keyCode !== 8 && keyCode !== 32 && key.length > 1) {
        return;
      }
      
      if (incorrectCharCount > 5 && keyCode !== 8) {
        event.preventDefault();
        setError(true);
        return;
      }

      if (incorrectCharCount !== 0) {
        if (keyCode === 8) {
          stompClient.send("/app/gameplay/" + gameId + '/' + sessionId, {}, backspace);
          setIncorrectCharCount(incorrectCharCount - 1);
          setTextField(textField.slice(0, -1));            
          setError(false);
        } else {
          stompClient.send("/app/gameplay/" + gameId + '/' + sessionId, {}, JSON.stringify(key));
          setIncorrectCharCount(incorrectCharCount + 1);
          setTextField(textField + key);
        }
      } else if (keyCode === 8) {
        event.preventDefault();
      } else if (gameText[localPosition] === key) {
        stompClient.send("/app/gameplay/" + gameId + '/' + sessionId, {}, JSON.stringify(key));
        setLocalPosition(localPosition + 1);

        if (gameText.length - 1 === localPosition) {
          setLocalStatus("READY");
          setTextField('');
          setLocalPosition(0);
          setIncorrectCharCount(0);
          return;
        }

        // Spacebar
        if (keyCode === 32) {
          setTextField('');
        } else {
          setTextField(textField + key);
        }
      } else {
        stompClient.send("/app/gameplay/" + gameId + '/' + sessionId, {}, JSON.stringify(key));
        setIncorrectCharCount(incorrectCharCount + 1);
        setTextField(textField + key);
      }
    }

    useEffect(() => {
      if (gameId) {
        connectTimer.current = setInterval(() => {
          if (!stompClient.connected) {
            socket = new SockJS(GLOBAL.API + '/new-player');
            stompClient = Stomp.over(socket);
            // Disables logs from stomp.js (used only for debugging)
            // stompClient.debug = () => {};
            stompClient.connect({ 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }, () => {
              var sessionId = /\/([^/]+)\/websocket/.exec(socket._transport.url)[1];
              setSessionId(sessionId);
  
              // Subscription for game events
              stompClient.subscribe('/game/gameplay/' + gameId, (game) => {
                var result = JSON.parse(game.body);
                setGame(result);
              });
  
              // Subscription for syncing client-side game status with server-side game status
              stompClient.subscribe('/game/status/' + gameId, (gameStatus) => {
                var statusResult = JSON.parse(gameStatus.body);
                setGameStatus(statusResult);
              });

              // Subscription for exceptions thrown serverside
              stompClient.subscribe('/game/errors/' + gameId + '/' + sessionId, (backendError) => {
                setServerError(backendError.body);
              });
  
  
            }, (error) => console.log(error));
          } else {
            clearInterval(connectTimer.current);
          }
        }, 1000)
      }

      return async () => {
        clearInterval(connectTimer.current);
      }
  }, [gameId])

    // Used to disconnect the client once they leave the gameplay page
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
          } else if (localStatus == "READY" && gameStatus.status === "IN_PROGRESS") {
            return 90;
          } else if (!created && gameStatus.status === "READY") {
            return 90;
          } else {
            return prevSeconds - 1;
          }
        })
      }, 1000)
    }, [localStatus, gameStatus.status, created])

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

      if (firstRender.current) {
        firstRender.current = false;
        return;
      }


      if (gameStatus.status === "WAITING_FOR_ANOTHER_PLAYER") {
        clearInterval(countdownTimer.current);
        setSeconds(5);
        setIsCountdown(false);
      } else if (gameStatus.status === "IN_PROGRESS") {
        setLocalStatus("IN_PROGRESS");
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
    }, [gameStatus, create, gameId, sessionId, seconds])

    useEffect(() => {
      // Used for countdown      
      if (gameStatus.status === "COUNTDOWN") {
        clearInterval(countdownTimer.current);
        setIsCountdown(true);
        countdownTimer.current = setInterval(() => {
          setSeconds((prevSeconds) => {
            if (prevSeconds === 1) {
              setStartGameBool(true);
              return prevSeconds - 1;
            } else if (prevSeconds === 0) {
              clearInterval(countdownTimer.current);
              setIsCountdown(false);
              setSeconds(5);
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
      const styles = {
        // WebkitTouchCallout: 'none',
        // WebkitUserSelect: 'none',
        // KhtmlUserSelect: 'none',
        // MozUserSelect: 'none',
        // msUserSelect: 'none',
        // userSelect: 'none'
      }
      if (gameStatus.status !== "IN_PROGRESS" || !game.players || !game.players[sessionId]) {
        return styles;
      }

      const position = game.players[sessionId].position;
      if (idx < position) {
        styles['backgroundColor'] = "#5fb6e2";
      } else if (idx >= position && idx < position + game.players[sessionId].incorrectCharacters.length) {
        styles['backgroundColor'] = "#ff9a9a";
      }
      return styles;
    }


    const playerListIndicator = (idx) => {
      const returnVal = {};
      if (idx === 1) {
        returnVal['borderTop'] = "5px solid red";
      } else if (idx === 2) {
        returnVal['borderBottom'] = "5px solid blue"; 
      } else if (idx === 3) {
        returnVal['borderLeft'] = "5px solid green";
      } else if (idx === 4) {
        returnVal['borderRight'] = "5px solid brown";
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
                  severity="info"
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
            <Typography sx={{cursor: 'pointer'}} 
                        onClick={() => {
                          navigator.clipboard.writeText(GLOBAL.DOMAIN + '/multiplayer/' + gameId);
                          setLinkCopied(true);
                        }} 
                        variant="h5" 
                        color="common.white"
            >
              Click here to copy an invitation to this game and share it with your friends!
            </Typography>
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
                        variant="outlined"
                        error={error}
                        helperText={error && "Fix Mistakes First!"}
                        style={{backgroundColor: "white"}}
                        onKeyDown={handleKeyDown}
                        value={textField}/> 
            </Grid>
            <Grid item padding='20px'>
              {isCountdown && <Grid item><Typography className={classes.color} sx={{textAlign: 'center'}} variant="h4" color="common.white">{seconds ? seconds : "GO!"}</Typography></Grid>}
              {created && 
              <Grid item>
                <Button variant="contained" 
                        disabled={gameStatus.status !== "READY"} 
                        onClick={startGame}>Start Game!</Button>
              </Grid>}
              {gameStatus.status === "WAITING_FOR_ANOTHER_PLAYER" && <Typography className={classes.color} sx={{textAlign: 'center'}} variant="h4" color="common.white">Waiting for another player!</Typography>}
              {!created && (gameStatus.status !== "IN_PROGRESS" && gameStatus.status !== "COUNTDOWN") && <Typography variant="h4" color="common.white">Please wait for the host to start the game!</Typography>}
            </Grid>
            {players && players.map((player, idx) => {
              if (player) {
                return (
                <Grid className={classes.color} key={idx} container sx={{padding: '10px'}} direction="row" columnSpacing={3} justifyContent="center" alignItems="center">
                  <Grid item>
                    <Typography sx={playerListIndicator(idx)} variant="p" color="common.white">{player[0]}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography color="common.white">  </Typography>
                  </Grid>
                  <Grid item>
                    <Typography color="common.white">Errors: {game.players && game.players[player[1]] && game.players[player[1]].failedCharacters.length} </Typography>
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
        </React.Fragment>
    );
  };

  export default MultiGame;