import React from "react";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { useEffect, useState, useRef } from 'react';
import { Grid, TextField, Button, Typography, Card, CardContent } from "@mui/material";
import ProgressBar from "../ProgressBar/ProgressBar";
import { CustomTextAlert, CustomBoolAlert } from '../Alerts/CustomAlert';
import { reinitializeConnection } from '../GameCommons';
import GLOBAL from '../../resources/Global';
import { useStyles } from '../../hooks/useGameStyles'

var socket = new SockJS(GLOBAL.API + '/new-player');
var stompClient = Stomp.over(socket);


const SingleGame = ({ gameId }) => {
    const [sessionId, setSessionId] = useState("");
    const [seconds, setSeconds] = useState(5);
    const [isCountdown, setIsCountdown] = useState(false);
    const [gameStatus, setGameStatus] = useState({
      gameText: [],
      status: '',
      player: null
    });
    const [game, setGame] = useState({
        player: null
    });
    const [disconnectSeconds, setDisconnectSeconds] = useState(90);
    const [gameText, setGameText] = useState([]);
    const [textField, setTextField] = useState('');
    const [serverError, setServerError] = useState('');
    const [error, setError] = useState(false);
    const backspace = JSON.stringify('\b');
    const interval = useRef();
    const connectInterval = useRef();
    const [localPosition, setLocalPosition] = useState(0);
    const [localStatus, setLocalStatus] = useState("READY");
    const [incorrectCharCount, setIncorrectCharCount] = useState(0);
    const [startGameBool, setStartGameBool] = useState(false);
    const [disconnected, setDisconnected] = useState(false);
    const disconnectTimer = useRef();

    const classes = useStyles();

    const startGame = () => {
        if (!stompClient.connected) {
          alert("Not connected yet");
          return;
        }
        setDisconnectSeconds(90);
        if (localStatus === "READY") {
            stompClient.send("/app/timer/single/" + gameId + '/' + sessionId, {}, gameId);
        }
        setIsCountdown(true);
        interval.current = setInterval(() => {
          setSeconds((prevSeconds) => {
            if (prevSeconds === 1) {
              setStartGameBool(true);
              return prevSeconds - 1;
            } else if (prevSeconds === 0) {
              clearInterval(interval.current);
              setIsCountdown(false);
              setSeconds(5);
            } else {
              return prevSeconds - 1;
            }
          });
        } ,  1000 );
    }

    const handleKeyDown = event => {
        if (localStatus === "READY" || !stompClient.connected) {
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
          // Backspace
          if (keyCode === 8) {
            stompClient.send("/app/gameplay/single/" + gameId + '/' + sessionId, {}, backspace);
            setIncorrectCharCount(incorrectCharCount - 1);
            setTextField(textField.slice(0, -1));            
            setError(false);
          } else {
            stompClient.send("/app/gameplay/single/" + gameId + '/' + sessionId, {}, JSON.stringify(key));
            setIncorrectCharCount(incorrectCharCount + 1);
            setTextField(textField + key);
          }
        } else if (keyCode === 8) {
          event.preventDefault();
        } else if (gameText[localPosition] === key) {
          stompClient.send("/app/gameplay/single/" + gameId + '/' + sessionId, {}, JSON.stringify(key));
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
          stompClient.send("/app/gameplay/single/" + gameId + '/' + sessionId, {}, JSON.stringify(key));
          setIncorrectCharCount(incorrectCharCount + 1);
          setTextField(textField + key);
        }
    }

    useEffect(() => {
      if (startGameBool) {
        stompClient.send("/app/start/single/" + gameId + '/' + sessionId, {}, gameId);
        setStartGameBool(false);
      }
    }, [startGameBool, gameId, sessionId])
  
    useEffect(() => {
        if (gameId) {
          connectInterval.current = setInterval(() => {
            if (!stompClient.connected) {
              socket = new SockJS(GLOBAL.API + '/new-player');
              stompClient = Stomp.over(socket);
              var link = GLOBAL.SINGLE;
              reinitializeConnection({gameId, link, stompClient, socket, setSessionId, setGame, setGameStatus, setServerError});
            } else {
              clearInterval(connectInterval.current);
            }
          }, 1000)
        }

        return async () => {
          clearInterval(connectInterval.current);
        }
    }, [gameId])

    useEffect(() => {
        if (stompClient.connected) {
          stompClient.send("/app/create/single/" + gameId + '/' + sessionId, {}, JSON.stringify({'username': localStorage.getItem('username')}));
        }
    }, [gameId, sessionId])

    useEffect(() => {
      if (gameStatus.status === "IN_PROGRESS") {
        setLocalStatus("IN_PROGRESS");
      }
      setGameText(gameStatus.gameText);
    }, [gameStatus])

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
        clearInterval(interval.current);
        if (stompClient.connected) {
          stompClient.disconnect();
        }
      }
    }, [])

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
      if (gameStatus.status !== "IN_PROGRESS" || !game.player) {
        return styles;
      }

      const position = game.player.position;
      if (idx < position) {
        styles['backgroundColor'] = "#5fb6e2";
      } else if (idx >= position && idx < position + game.player.incorrectCharacters.length) {
        styles['backgroundColor'] = "#ff9a9a";
      }
      return styles;
    }

    return (
        <React.Fragment>
            <Grid item>
              <CustomTextAlert inputText={serverError} severityType="error"/>
            </Grid>
            <Grid item>
              <CustomBoolAlert input={disconnected} severityType="error" text="You have been disconnected due to inactivity." />
            </Grid>
            <Grid item>
              {gameStatus.status && gameStatus.status === "READY" && !isCountdown && <Typography className={classes.color} sx={{textAlign: 'center'}} variant="h5" color="common.white">Click START GAME! to begin playing!</Typography>}
              {disconnectSeconds < 11 && <Typography variant="h5" className={classes.color} sx={{textAlign: 'center'}} color="common.white">{"You will be disconnected in " + disconnectSeconds + " seconds due to inactivity."}</Typography>}
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
            <Grid item>
              {isCountdown && <Typography className={classes.color} sx={{textAlign: 'center'}} variant="h4" color="common.white">{seconds ? seconds : "GO!"}</Typography>}
              {<Grid item><Button variant="contained" disabled={gameStatus.status === "IN_PROGRESS" || gameStatus.status === ''} onClick={startGame}>Start Game!</Button></Grid>}
            </Grid>
            {game.player && 
            <Grid container sx={{padding: '3px'}} direction="row" columnSpacing={3} justifyContent="center" alignItems="center">
                <Grid item>
                    <Typography variant="p" color="common.white">{game.player.username}</Typography>
                </Grid>
                <Grid item>
                    <Typography color="common.white"> Average Speed </Typography>
                  </Grid>
                  <Grid item>
                    <Typography color="common.white">Errors: {game.player.failedCharacters.length} </Typography>
                  </Grid>
                <Grid item>
                    <ProgressBar playerPosition={gameStatus.status === "IN_PROGRESS" ? game.player.position : 0} lastPosition={gameStatus.gameText.length} />
                </Grid>
            </Grid>
            }
        </React.Fragment>
    );
  };

  export default SingleGame;