import React from "react";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { useEffect, useState, useRef } from 'react';
import Background from "../components/Background";
import MultiplayImage from "../images/multiplayerbackground.png";
import { useParams } from "react-router";
import { Grid } from "@mui/material";
import { useAuthorization } from "../hooks/useAuthorization";
import MultiGame from "../components/MultiGame/MultiGame";

const socket = new SockJS('http://localhost:8080/new-player');
const stompClient = Stomp.over(socket);

const MultiplayerCreate = () => {
    const { instance } = useAuthorization();
    const [gameId, setGameId] = useState(useParams().gameIdUrl);

    useEffect(() => {
        const getGameId = async () => {
            const data = await instance.get(`/get-game-id`).then(
            result => result.data);
            if (data) {
              setGameId(data);
            }
        }
        getGameId();
      }, []);

    return (
        <React.Fragment>
            <Background imgPath={MultiplayImage}>
                <Grid container sx={{padding: '50px'}} direction="column" rowSpacing={3} justifyContent="flex-end" alignItems="center">
                        <MultiGame gameId={gameId} create={true} />
                </Grid>                   
            </Background>
        </React.Fragment>
    );
  };

  export default MultiplayerCreate;