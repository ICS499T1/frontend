import React from "react";
import { useEffect, useState, useRef } from 'react';
import Background from "../components/Background";
import SinglePlayerImage from "../images/space.png";
import { useParams } from "react-router";
import { Grid } from "@mui/material";
import { useAuthorization } from "../hooks/useAuthorization";
import SingleGame from "../components/SingleGame/SingleGame";

const SinglePlayerCreate = () => {
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
            <Background imgPath={SinglePlayerImage}>
                <Grid container sx={{padding: '50px'}} direction="column" rowSpacing={3} justifyContent="flex-end" alignItems="center">
                        <SingleGame gameId={gameId} />
                </Grid>                   
            </Background>
        </React.Fragment>
    );
  };

  export default SinglePlayerCreate;