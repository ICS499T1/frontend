import React from "react";
import { useEffect, useState } from 'react';
import Background from "../components/Background";
import MultiplayImage from "../images/multiplayerbackground.png";
import { useParams } from "react-router";
import { Grid } from "@mui/material";
import { useAuthorization } from "../hooks/useAuthorization";
import MultiGame from "../components/MultiGame/MultiGame";

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
    }, [instance]);

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