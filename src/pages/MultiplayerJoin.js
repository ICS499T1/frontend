import React from "react";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import Background from "../components/Background";
import MultiplayImage from "../images/multiplayerbackground.png";
import { useParams } from "react-router";
import { Grid } from "@mui/material";
import MultiGame from "../components/MultiGame/MultiGame";

const socket = new SockJS('http://localhost:8080/new-player');
const stompClient = Stomp.over(socket);

const MultiplayerJoin = () => {
    const { gameId } = useParams();

    return (
        <React.Fragment>
            <Background imgPath={MultiplayImage}>
                <Grid container sx={{padding: '50px'}} direction="column" rowSpacing={3} justifyContent="flex-end" alignItems="center">
                    <MultiGame gameId={gameId} create={false} />
                </Grid>                   
            </Background>
        </React.Fragment>
    );
  };

  export default MultiplayerJoin;