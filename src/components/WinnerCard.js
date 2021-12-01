import React from "react";
import { Grid, Typography } from "@mui/material";
import { useStyles } from '../hooks/useGameStyles'

const WinnerCard = ({username, speed, accuracy}) => {
    const styles = useStyles();

    return(
        <Grid container className={styles.color} justify="center" rowSpacing={2} direction="column">
            <Grid item sx={{textAlign: 'center'}}>
                <Typography variant="h4" color="common.white">{username + " is the winner!"}</Typography>
            </Grid>
            <Grid item sx={{textAlign: 'center'}}>
                <Typography variant="h5" color="common.white">{"Speed: " + speed} </Typography>
            </Grid>
            <Grid item sx={{textAlign: 'center'}}>    
                <Typography variant="h5" color="common.white">{"Accuracy: " + accuracy}</Typography>
            </Grid>
        </Grid>
    );
}

export default WinnerCard;