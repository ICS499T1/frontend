import React from "react";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { useEffect, useState, useRef } from 'react';
import { Grid, TextField, Button, Typography, Card, CardContent, LinearProgress } from "@mui/material";
import ProgressBar from "../ProgressBar/ProgressBar";

// const socket = new WebSocket('ws://localhost:8080/new-player');
const socket = new SockJS('http://localhost:8080/new-player');
const stompClient = Stomp.over(socket);

const styles = {
  blueStyle: {
    color: "blue"
  },
  redStyle: {
    color: "red"
  },
  blackStyle: {
    color: "black"
  }
}

const styles3 = {
  1: {
    borderTop: "5px solid red"
  },
  2: {
    borderBottom: "5px solid blue"
  },
  3: {
    borderLeft: "5px solid green"
  },
  4: {
    borderRight: "5px solid brown"
  }
}

const MultiGame = ({ gameId, create }) => {
    const [sessionId, setSessionId] = useState("");
    const [connected, setConnected] = useState(false);
    const [seconds, setSeconds] = useState(5);
    const [isCountdown, setIsCountdown] = useState(false);
    const [gameStatus, setGameStatus] = useState({
      gameText: [],
      status: '',
      players: null
    });
    const [startClicked, setStartClicked] = useState(false);
    const [startGameBool, setStartGameBool] = useState(false);
    const [game, setGame] = useState({
        players: null,
        winner: null
    });
    const [playerStatus, setPlayerStatus] = useState(0);
    const [gameText, setGameText] = useState([]);
    const [textField, setTextField] = useState('');
    const [error, setError] = useState(false);
    const [players, setPlayers] = useState(null);
    const backspace = JSON.stringify('\b');
    const interval = useRef();
    const firstRender = useRef(true);

    const startGame = () => {
        if (!stompClient.connected) {
          alert("Not connected yet");
          return;
        }
        if (gameStatus.status != "READY" && gameStatus.status != "COMPLETED") {
          alert("Game cannot be started yet.");
        }
        if (gameStatus.status == "COMPLETED") {
          setStartClicked(true);
          stompClient.send("/app/end/" + gameId, {}, gameId);
          return;
        }
        stompClient.send("/app/timer/" + gameId, {}, gameId);

    }

    const handleKeyDown = event => {
        if (gameStatus.status != "IN_PROGRESS") {
          event.preventDefault();
          return;
        }
        var key = event.key;
        var keyCode = event.keyCode;
        var position = game.players[sessionId].position;
        var incorrectLength = game.players[sessionId].incorrectCharacters.length

        if (playerStatus) {
          event.preventDefault();
          return;
        }
        
        if (incorrectLength > 5 && keyCode !== 8) {
          event.preventDefault();
          setError(true);
          return;
        }
        // backspace 
        if (keyCode === 8) {
          if (incorrectLength === 0) {
            event.preventDefault();
          } else {
            stompClient.send("/app/gameplay/" + gameId, {}, backspace);
            setError(false);
            setTextField(textField.slice(0, -1));
          }
        } else {
            event.target.selectionStart = event.target.selectionEnd = event.target.value.length;
            if (key.length === 1) {
              stompClient.send("/app/gameplay/" + gameId, {}, JSON.stringify(key));
              // spacebar
              if (key === gameText[position] && keyCode !== 32) {
                setTextField(textField + key);
              } else if (key === gameText[position] && keyCode === 32 && incorrectLength === 0) {
                setTextField('');                
              } else {
                setTextField(textField + key);
              }
            }
        }
    }

    useEffect(() => {
        if (gameId) {
          stompClient.connect({ 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }, () => {
            var sessionId = /\/([^/]+)\/websocket/.exec(socket._transport.url)[1];
            setSessionId(sessionId);
            setConnected(stompClient.connected);

            // Subscription for game events
            stompClient.subscribe('/game/gameplay/' + gameId, (game) => {
              var result = JSON.parse(game.body);
              setGame(result);
            });

            // Subscription for syncing client-side game status with server-side game status
            stompClient.subscribe('/game/status/' + gameId, (gameStatus) => {
              var statusResult = JSON.parse(gameStatus.body);
              setGameStatus(statusResult);
            })

            // Subscription for keeping track of current player's status (whether they can type or not)
            stompClient.subscribe('/game/playerStatus/' + gameId + '/' + sessionId, (playerStatus) => {
              setPlayerStatus(JSON.parse(playerStatus.body));
            })

            // Subscription for a game text update when game is reset, created, or joined
            // stompClient.subscribe('/game/gameText/' + gameId, (action) => {
            //   setGameText(JSON.parse(action.body));
            // });

            // Subscription for starting timer simultaneously on all clients
            // stompClient.subscribe('/game/startTimer/' + gameId, (message) => {
            //   setIsCountdown(true);
            //   setPlayerStatus(0);
            // });
          }, (error) => console.log())
        }
    }, [gameId])

    useEffect(() => {
        if (stompClient.connected && create) {
          stompClient.send("/app/create/" + gameId, {}, JSON.stringify({'username': localStorage.getItem('username')}));
        }
        if (stompClient.connected && !create) {
            stompClient.send("/app/join/" + gameId, {}, JSON.stringify({'username': localStorage.getItem('username')}));
        }
    }, [connected])

    useEffect(() => {
      if (startGameBool && create) {
        stompClient.send("/app/start/" + gameId, {}, gameId);
        setStartGameBool(false);
      } else if (startGameBool) {
        setStartGameBool(false);
      }
    }, [startGameBool])

    useEffect(() => {
      if (firstRender.current) {
        firstRender.current = false;
        return;
      }
      if (gameStatus.status == "READY" && startClicked) {
        setStartClicked(false);
        startGame();
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
      if (gameStatus.status == "COUNTDOWN") {
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
      } else if (gameStatus.status != "COUNTDOWN") {
        clearInterval(interval.current);
        setSeconds(5);
        setIsCountdown(false);
      }
      // Set game text only when status updates, and with every gameplay update
      setGameText(gameStatus.gameText);
    }, [gameStatus])

    useEffect(() => {
      if (playerStatus) {
        setTextField('');
      }
    }, [playerStatus])

    useEffect(() => {
      const stringstuff = JSON.stringify(players);
      console.log(players);
    }, [players])

    const color = (idx) => {
      if(gameStatus.status == "IN_PROGRESS") {
        if (idx < game.players[sessionId].position) {
          return (styles.blueStyle);
        } else if (idx >= game.players[sessionId].position && idx < game.players[sessionId].position + game.players[sessionId].incorrectCharacters.length) {
          return (styles.redStyle);
        }
        return (styles.blackStyle);
      }
      return (styles.blackStyle);
    }

    const gameplayIndicator = (idx) => {
      // TODO uncomment to make text unselectable
      const styles2 = {
        // WebkitTouchCallout: 'none',
        // WebkitUserSelect: 'none',
        // KhtmlUserSelect: 'none',
        // MozUserSelect: 'none',
        // msUserSelect: 'none',
        // userSelect: 'none'
      }
      if (gameStatus.status != "IN_PROGRESS") {
        return styles2;
      }

      const position = game.players[sessionId].position;
      if (idx < position) {
        styles2['backgroundColor'] = "#5fb6e2";
      } else if (idx >= position && idx < position + game.players[sessionId].incorrectCharacters.length) {
        styles2['backgroundColor'] = "#ff9a9a";
      }

      for(let i = 1; i < 5; i++){
        if (!players[i]) {
          continue;
        }
        const playerPosition = game.players[players[i][1]].position;
        if (idx == playerPosition) {
          Object.keys(styles3[i]).forEach( key => {
            styles2[key] = styles3[i][key];
          })
        }
      }
      return styles2;
    }

    const playerListIndicator = (idx) => {
      const returnVal = {};
      if (idx == 1) {
        returnVal['borderTop'] = "5px solid red";
      } else if (idx == 2) {
        returnVal['borderBottom'] = "5px solid blue"; 
      } else if (idx == 3) {
        returnVal['borderLeft'] = "5px solid green";
      } else if (idx == 4) {
        returnVal['borderRight'] = "5px solid brown";
      }
      return returnVal;
    }

    return (
        <React.Fragment>
            <Grid item>
            <Typography variant="h4" color="common.white">{gameId}</Typography>
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
              {isCountdown && <Typography variant="h4" color="common.white">{seconds}</Typography>}
              {create && <Grid item><Button variant="contained" onClick={startGame}>Start Game!</Button></Grid>}
              {!create && (gameStatus.status != "IN_PROGRESS") && <Typography variant="h4" color="common.white">Please wait for the host to start the game!</Typography>}
            </Grid>
            <Grid item>
              <LinearProgress variant="determinate" value={50} />
            </Grid>
            {players && players.map((player, idx) => {
              if (player) {
                return (
                <Grid key={idx} container sx={{padding: '3px'}} direction="row" columnSpacing={3} justifyContent="center" alignItems="center">
                  <Grid item>
                    <Typography sx={playerListIndicator(idx)} variant="p" color="common.white">{player[0]}</Typography>
                  </Grid>
                  <Grid item>
                    <ProgressBar playerPosition={game.players ? game.players[player[1]].position : 0} lastPosition={gameStatus.gameText.length} />
                  </Grid>
                </Grid>
                )
              }
            })}
        </React.Fragment>
    );
  };

  export default MultiGame;