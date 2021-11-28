import React from "react";
import { useEffect } from 'react';
import Background from "../components/Background";
import MultiplayImage from "../images/multiplayerbackground.png";
import { useParams } from "react-router";
import { Grid } from "@mui/material";
import MultiGame from "../components/MultiGame/MultiGame";
import { useAuthorization } from "../hooks/useAuthorization";

const MultiplayerJoin = () => {
    const { gameId } = useParams();

    const { instance } = useAuthorization();

    // This axios instance will refresh the token if it has expired, the if statement is to suppress a warning
    useEffect(() => {
        const getGameId = async () => {
            await instance.get(`/get-game-id`).then(
            result => result.data);      
        }
        getGameId();
    }, [instance]);

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