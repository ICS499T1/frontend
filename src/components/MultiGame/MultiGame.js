import React from "react";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { useEffect, useState, useRef } from 'react';
import { Grid, TextField, Button, Typography, Card, CardContent, Collapse, Alert, IconButton } from "@mui/material";
import ProgressBar from "../ProgressBar/ProgressBar";
import { makeStyles } from "@material-ui/core";
import CloseIcon from '@mui/icons-material/Close';
import { padding } from "@mui/system";
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
    const connectInterval = useRef();
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
    const [playerStatus, setPlayerStatus] = useState(0);
    const [gameText, setGameText] = useState([]);
    const [textField, setTextField] = useState('');
    const [serverError, setServerError] = useState('');
    const [error, setError] = useState(false);
    const [players, setPlayers] = useState(null);
    const [localPosition, setLocalPosition] = useState(0);
    const [incorrectCharCount, setIncorrectCharCount] = useState(0);
    const backspace = JSON.stringify('\b');
    const interval = useRef();
    const firstRender = useRef(true);
   

    const startGame = () => {
        if (!stompClient.connected) {
          alert("Not connected yet");
          return;
        }
        stompClient.send("/app/timer/" + gameId + '/' + sessionId, {}, gameId);
    }
    const classes = useStyles();

    const handleKeyDown = event => {
      if (gameStatus.status !== "IN_PROGRESS") {
        event.preventDefault();
        return;
      }
      var key = event.key;
      var keyCode = event.keyCode;

      if (keyCode !== 8 && keyCode !== 32 && key.length > 1) {
        return;
      }
      
      if (playerStatus) {
          event.preventDefault();
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
        connectInterval.current = setInterval(() => {
          if (!stompClient.connected) {
            socket = new SockJS(GLOBAL.API + '/new-player');
            stompClient = Stomp.over(socket);
            // Disables logs from stomp.js (used only for debugging)
            //stompClient.debug = () => {};
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
  
              // Subscription for knowing when to enable/disable text field usage
              stompClient.subscribe('/game/playerStatus/' + gameId + '/' + sessionId, (playerStatus) => {
                  setPlayerStatus(JSON.parse(playerStatus.body));
              });
  
              // Subscription for exceptions thrown serverside
              stompClient.subscribe('/game/errors/' + gameId + '/' + sessionId, (backendError) => {
                setServerError(backendError.body);
              });
  
  
            }, (error) => console.log(error));
          } else {
            clearInterval(connectInterval.current);
          }
        }, 1000)
      }
  }, [gameId])

    // Used to disconnect the client once they leave the gameplay page
    useEffect(() => {
      return async () => {
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

      if (gameStatus.status === "READY") {
        setLocalPosition(0);
        setIncorrectCharCount(0);
      }

      if (gameStatus.players[sessionId].playerNumber === 1) {
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

      // Used for countdown      
      if (gameStatus.status === "COUNTDOWN") {
        setIsCountdown(true);
        interval.current = setInterval(() => {
          setSeconds((prevSeconds) => {
            if (prevSeconds === 0) {
              clearInterval(interval.current);
              setSeconds(5);
              setIsCountdown(false);
              setStartGameBool(true);
              return;
            } else {
              return prevSeconds - 1
            }
          });
        } ,  1000 )
        setPlayerStatus(0);        
      } else if (gameStatus.status !== "COUNTDOWN") {
        clearInterval(interval.current);
        setSeconds(5);
        setIsCountdown(false);
      }
      // Set game text only when status updates
      setGameText(gameStatus.gameText);
    }, [gameStatus, create, gameId, sessionId])

    useEffect(() => {
      if (playerStatus) {
        setTextField('');
      }
    }, [playerStatus])

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
      if (gameStatus.status !== "IN_PROGRESS") {
        return styles;
      }
      // if (game.players) {
      //   console.log(game.players);
      // }
      const position = game.players[sessionId].position;
      if (idx < position) {
        styles['backgroundColor'] = "#5fb6e2";
      } else if (idx >= position && idx < position + game.players[sessionId].incorrectCharacters.length) {
        styles['backgroundColor'] = "#ff9a9a";
      }

      // for(let i = 1; i < 5; i++){
      //   if (!players[i]) {
      //     continue;
      //   }
      //   const playerPosition = game.players[players[i][1]].position;
      //   if (idx == playerPosition) {
      //     Object.keys(styles3[i]).forEach( key => {
      //       styles2[key] = styles3[i][key];
      //     })
      //   }
      // }
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
              <Collapse in={serverError !== ''}>
                <Alert
                  severity="error"
                  action={
                  <IconButton
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setServerError('');
                    }}
                  >
                  <CloseIcon fontSize="inherit" />
                  </IconButton>
                  }
                sx={{ mb: 2 }}>
                  {serverError}
                </Alert>
              </Collapse>
            </Grid>
            <Grid item>
            <Typography variant="p" color="common.white">Game code:</Typography>
            <Typography variant="h5" color="common.white">{gameId}</Typography>
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
              {isCountdown && <Typography variant="h4" color="common.white">{seconds ? seconds : "GO!"}</Typography>}
              {created && 
              <Grid item>
                <Button variant="contained" 
                        disabled={gameStatus.status !== "READY"} 
                        onClick={startGame}>Start Game!</Button>
              </Grid>}
              {gameStatus.status === "WAITING_FOR_ANOTHER_PLAYER" && <Typography variant="h4" color="common.white">Waiting for another player!</Typography>}
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
                    <Typography color="common.white"> Average Speed </Typography>
                  </Grid>
                  <Grid item>
                    <Typography color="common.white"> Errors </Typography>
                  </Grid>
                  <Grid item>
                    <ProgressBar playerPosition={(game.players && gameStatus.status === "IN_PROGRESS") ? game.players[player[1]].position : 0} lastPosition={gameStatus.gameText.length} />
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