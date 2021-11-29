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
    const [sessionId, setSessionId] = useState("");
    const [countdownSeconds, setCountdownSeconds] = useState(GLOBAL.COUNTDOWN_SECONDS);
    const [isCountdown, setIsCountdown] = useState(false);
    const [gameStatus, setGameStatus] = useState({
      gameText: [],
      status: '',
      player: null
    });
    const [game, setGame] = useState({
        player: null
    });
    const [disconnectSeconds, setDisconnectSeconds] = useState(GLOBAL.DISCONNECT_SECONDS);
    const [gameText, setGameText] = useState([]);
    const [serverError, setServerError] = useState('');
    const [error, setError] = useState(false);
    const countdownTimer = useRef();
    const connectTimer = useRef();
    const localPosition = useRef(0);
    const localStatus = useRef("READY");
    const incorrectCharCount = useRef(0);
    const [startGameBool, setStartGameBool] = useState(false);
    const [disconnected, setDisconnected] = useState(false);
    const textField = useRef();
    const disconnectTimer = useRef();
    const classes = useStyles();

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

    const handleKeyDown = event => {
        var link = '/gameplay/single'
        if (localStatus.current === "READY" || !stompClient.connected) {
          event.preventDefault();
          return;
        }
        handleKey({event, link, incorrectCharCount, stompClient, gameText, localPosition, localStatus, textField, gameId, sessionId, setDisconnectSeconds, setError});
    }

    useEffect(() => {
      if (startGameBool) {
        stompClient.send("/app/start/single/" + gameId + '/' + sessionId, {}, gameId);
        setStartGameBool(false);
      }
    }, [startGameBool, gameId, sessionId])
  
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

    useEffect(() => {
        if (stompClient.connected) {
          stompClient.send("/app/create/single/" + gameId + '/' + sessionId, {}, JSON.stringify({'username': localStorage.getItem('username')}));
        }
    }, [gameId, sessionId])

    useEffect(() => {
      if (gameStatus.status === "IN_PROGRESS") {
        localStatus.current = "IN_PROGRESS";
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
        clearInterval(countdownTimer.current);
        if (stompClient.connected) {
          stompClient.disconnect();
        }
      }
    }, [])


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
                        inputRef={textField}
                        variant="outlined"
                        error={error}
                        helperText={error && "Fix Mistakes First!"}
                        style={{backgroundColor: "white"}}
                        onKeyDown={handleKeyDown}/> 
            </Grid>
            <Grid item padding='20px'>
              {isCountdown && <Typography className={classes.color} sx={{textAlign: 'center'}} variant="h4" color="common.white">{countdownSeconds ? countdownSeconds : "GO!"}</Typography>}
              {stompClient.connected ? 
                <Grid item>
                  <Button variant="contained" disabled={gameStatus.status === "IN_PROGRESS" || gameStatus.status === ''} onClick={startGame}>
                    Start Game!
                  </Button>
                </Grid> : 
                <CustomTextAlert inputText={"Not connected"} severityType="error"/>}
            </Grid>
            {game.player && 
            <Grid className={classes.color} container sx={{padding: '10px'}} direction="row" columnSpacing={3} justifyContent="center" alignItems="center">
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
        </React.Fragment>
    );
  };

  export default SingleGame;