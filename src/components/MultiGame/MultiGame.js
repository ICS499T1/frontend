import React from "react";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { useEffect, useState, useRef } from 'react';
import { Grid, TextField, Button, Typography, Card, CardContent } from "@mui/material";

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

const MultiGame = ({ gameId, create }) => {
    const [sessionId, setSessionId] = useState("");
    const [connected, setConnected] = useState(false);
    const [seconds, setSeconds] = React.useState(5);
    const [isCountdown, setIsCountdown] = useState(false);
    const [isGameStarted, setGameStarted] = useState(false);
    const [game, setGame] = useState({
        players: null,
        winner: null
    });
    const [gameText, setGameText] = useState([]);
    const [textField, setTextField] = useState('');
    const [error, setError] = useState(false);
    const backspace = JSON.stringify('\b');

    const startGame = () => {
        if (!stompClient.connected) {
          alert("Not connected yet");
          return;
        }
        setIsCountdown(true);
        stompClient.send("app/timer/" + gameId, {}, gameId);
        countdown();
        stompClient.send("/app/start/" + gameId, {}, gameId);
    }

    const countdown = () => {
      let interval = setInterval(() => {
        setSeconds((prevCountdown) => {
          if (prevCountdown === 0) {
            clearInterval(interval);
            setIsCountdown(false);
            setGameStarted(true);
            return;
          } else {
            return prevCountdown - 1
          }
        }  )
      } ,  1000 )
    };

    const handleKeyDown = event => {
        var key = event.key;
        var keyCode = event.keyCode;
        var position = game.players[sessionId].position;
        var incorrectLength = game.players[sessionId].incorrectCharacters.length
        
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
            stompClient.subscribe('/game/join/' + gameId, (game) => {
              var result = JSON.parse(game.body);
              // console.log(result);
              // console.log(result.status);
              setGame(result);
            });
            stompClient.subscribe('/game/gameText/' + gameId, (action) => {
              setGameText(JSON.parse(action.body));
            });
            stompClient.subscribe('/game/startTimer/' + gameId, (message) => {
              console.log("Message: ", JSON.parse(message.body));
            });
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

    const color = (idx) => {
      if (idx < game.players[sessionId].position) {
        return (styles.blueStyle)
      } else if (idx >= game.players[sessionId].position && idx < game.players[sessionId].position + game.players[sessionId].incorrectCharacters.length) {
        return (styles.redStyle)
      }
      return (styles.blackStyle)
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
                            return <span key={idx} style={color(idx)}>{char}</span>;
                        })}
                    </Typography>}
                </CardContent>
            </Card>
            </Grid>
            <Grid item>
            {(isGameStarted) ? 
            <TextField placeholder="Start Typing Here"
                       inputProps={{ spellCheck: 'false' }}
                       variant="outlined"
                       error={error}
                       helperText={error && "Fix Typos!"}
                       style={{backgroundColor: "white"}}
                       onKeyDown={handleKeyDown}
                       value={textField}/> 
                    : <TextField placeholder="Start Typing Here"
                      inputProps={{ spellCheck: 'false' }}
                      variant="outlined"
                      error={error}
                      helperText={error && "Fix Typos!"}
                      style={{backgroundColor: "white"}}
                      onKeyDown={handleKeyDown}
                      value={textField}
                      disabled={true} />
                      }
            </Grid>
              {isGameStarted ? <Grid /> : isCountdown ? <Typography variant="h4" color="common.white">{seconds}</Typography> : (create ? <Grid item><Button variant="contained" onClick={startGame}>Start Game!</Button></Grid> : <Typography variant="h4" color="common.white">Please wait for the host to start the game!</Typography>)}
            <Grid item>
              <Typography variant="h4" color="common.white">
                {game.players && game.players[sessionId].incorrectCharacters && game.players[sessionId].incorrectCharacters.map((char, idx) => char)}
              </Typography>
            </Grid>
        </React.Fragment>
    );
  };

  export default MultiGame;