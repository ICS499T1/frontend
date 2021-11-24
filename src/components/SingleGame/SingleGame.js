import React from "react";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { useEffect, useState, useRef } from 'react';
import { Grid, TextField, Button, Typography, Card, CardContent } from "@mui/material";
import ProgressBar from "../ProgressBar/ProgressBar";

// const socket = new WebSocket('ws://localhost:8080/new-player');
const socket = new SockJS('http://localhost:8080/new-player');
const stompClient = Stomp.over(socket);

const SingleGame = ({ gameId }) => {
    const [sessionId, setSessionId] = useState("");
    const [connected, setConnected] = useState(false);
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
    const [gameText, setGameText] = useState([]);
    const [textField, setTextField] = useState('');
    const [error, setError] = useState(false);
    const backspace = JSON.stringify('\b');
    const interval = useRef();
    const [playerStatus, setPlayerStatus] = useState(0);

    const startGame = () => {
        if (!stompClient.connected) {
          alert("Not connected yet");
          return;
        }
        if (gameStatus.status === "READY") {
            stompClient.send("/app/end/single/" + gameId + '/' + sessionId, {}, gameId);
        }
        setIsCountdown(true);
        interval.current = setInterval(() => {
          setSeconds((prevSeconds) => {
            if (prevSeconds === 0) {
              clearInterval(interval.current);
              setSeconds(5);
              setIsCountdown(false);
              stompClient.send("/app/start/single/" + gameId + '/' + sessionId, {}, gameId);
              return;
            } else {
              return prevSeconds - 1
            }
          });
        } ,  1000 )
        setPlayerStatus(0);  
    }

    const handleKeyDown = event => {
        if (gameStatus.status !== "IN_PROGRESS") {
          event.preventDefault();
          return;
        }
        var key = event.key;
        var keyCode = event.keyCode;
        var position = game.player.position;
        var incorrectLength = game.player.incorrectCharacters.length;
        
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
            stompClient.send("/app/gameplay/single/" + gameId + '/' + sessionId, {}, backspace);
            setError(false);
            setTextField(textField.slice(0, -1));
          }
        } else {
            event.target.selectionStart = event.target.selectionEnd = event.target.value.length;
            if (key.length === 1) {
              stompClient.send("/app/gameplay/single/" + gameId + '/' + sessionId, {}, JSON.stringify(key));
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
        if (playerStatus) {
          setTextField('');
        }
      }, [playerStatus])

    // TODO: add logic to refresh the access token for websockets
    useEffect(() => {
        if (gameId) {
          stompClient.connect({ 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }, () => {
            var sessionId = /\/([^/]+)\/websocket/.exec(socket._transport.url)[1];
            setSessionId(sessionId);
            setConnected(stompClient.connected);

            // Subscription for game events
            stompClient.subscribe('/game/single/gameplay/' + gameId, (game) => {
              var result = JSON.parse(game.body);
              setGame(result);
            });

            // Subscription for syncing client-side game status with server-side game status
            stompClient.subscribe('/game/single/status/' + gameId, (gameStatus) => {
              var statusResult = JSON.parse(gameStatus.body);
              setGameStatus(statusResult);
            })

            stompClient.subscribe('/game/single/playerStatus/' + gameId + '/' + sessionId, (playerStatus) => {
                setPlayerStatus(JSON.parse(playerStatus.body));
              })

            stompClient.subscribe('/game/single/errors/' + gameId + '/' + sessionId, (backendError) => {
              console.log(backendError.body);
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
        if (stompClient.connected) {
          stompClient.send("/app/create/single/" + gameId + '/' + sessionId, {}, JSON.stringify({'username': localStorage.getItem('username')}));
        }
    }, [connected])

    useEffect(() => {
      // Set game text only when status updates, and with every gameplay update
      setGameText(gameStatus.gameText);
    }, [gameStatus])

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
              {<Grid item><Button variant="contained" disabled={gameStatus.status === "IN_PROGRESS" || gameStatus.status === ''} onClick={startGame}>Start Game!</Button></Grid>}
            </Grid>
            {game.player && 
            <Grid container sx={{padding: '3px'}} direction="row" columnSpacing={3} justifyContent="center" alignItems="center">
                <Grid item>
                    <Typography variant="p" color="common.white">{game.player.username}</Typography>
                </Grid>
                <Grid item>
                    <ProgressBar playerPosition={(game.player && gameStatus.status === "IN_PROGRESS") ? game.player.position : 0} lastPosition={gameStatus.gameText.length} />
                </Grid>
            </Grid>
            }
        </React.Fragment>
    );
  };

  export default SingleGame;