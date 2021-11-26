import React from "react";
import Background from "../components/Background";
import MultiplayImage from "../images/multiplayerbackground.png";
import { useParams } from "react-router";
import { Grid } from "@mui/material";
import MultiGame from "../components/MultiGame/MultiGame";

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