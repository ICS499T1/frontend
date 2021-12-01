import React from "react";
import { Grid, Typography} from "@mui/material";
import { useStyles } from '../hooks/useGameStyles'

const WinnerCard = ({username, speed, accuracy}) => {
    const styles = useStyles();

    return(
        <Grid container className={styles.color} justify="center" rowSpacing={5} direction="column">
            <Grid item>
                <Typography sx={{textAlign: 'center'}} variant="h4" color="common.white">{"Winner!"}</Typography>
            </Grid>
            <Grid item>
                <Typography sx={{textAlign: 'center', align: 'left'}} variant="p" color="common.white">{"Username: " + username}</Typography>
                <Typography sx={{textAlign: 'center', align: 'center'}} variant="p" color="common.white">{" Speed: " + speed} </Typography>
                <Typography sx={{textAlign: 'center', align: 'right'}} variant="p" color="common.white">{" Accuracy: " + accuracy}</Typography>
            </Grid>
        </Grid>
    );
}

export default WinnerCard;