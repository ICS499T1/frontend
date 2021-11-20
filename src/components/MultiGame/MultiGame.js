import React from "react";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { useEffect, useState, useRef } from 'react';
import { Grid, TextField, Button, Typography, Card, CardContent } from "@mui/material";


const socket = new SockJS('http://localhost:8080/new-player');
const stompClient = Stomp.over(socket);

const MultiGame = ({ gameId, create }) => {
    const [sessionId, setSessionId] = useState("");
    const [connected, setConnected] = useState(false);
    const [game, setGame] = useState({
        gameText: '',
        players: null,
        winner: null
    });
    const [gameText, setGameText] = useState([]);
    const [textField, setTextField] = useState('');
    const backspace = JSON.stringify('\b');

    const startGame = () => {
        if (!stompClient.connected) {
          alert("Not connected yet");
          return;
        }
        stompClient.send("/app/start/" + gameId, {}, gameId);
    }

    const handleKeyDown = event => {
        var key = event.key;
    
        // backspace 
        if (event.keyCode === 8) {
          if (game.players[sessionId].incorrectCharacters.length === 0) {
            event.preventDefault();
          } else {
            stompClient.send("/app/gameplay/" + gameId, {}, backspace);
            setTextField(textField.slice(0, -1))
          }
        } else {
            event.target.selectionStart = event.target.selectionEnd = event.target.value.length;
            if (key.length === 1) {
                setTextField(textField + key);
                stompClient.send("/app/gameplay/" + gameId, {}, JSON.stringify(key));
              }
        //   textInput.current.selectionStart = textInput.current.selectionEnd = textInput.current.value.length;
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
              console.log(result.status);
              setGame(result);
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

    useEffect(() => {
        setGameText(game.gameText);
    }, [game.gameText])

    return (
        <React.Fragment>
            <Grid item>
            <Card sx={{ maxWidth: 500 }}>
                <CardContent>
                    {gameText && 
                    <Typography>
                        {gameText.map((char, idx) => {
                            return char;
                        })}
                    </Typography>}
                </CardContent>
            </Card>
            </Grid>
            <Grid item>
            <TextField id="outlined-multiline-flexible"
                       placeholder="Start Typing Here"
                       inputProps={{ spellCheck: 'false' }}
                       style={{backgroundColor: "white"}}
                       multiline
                       onKeyDown={handleKeyDown}
                       value={textField}
                       maxRows={3}/>
            </Grid>
            {create && <Grid item><Button variant="contained" onClick={startGame}>Start Game!</Button></Grid>}
        </React.Fragment>
    );
  };

  export default MultiGame;