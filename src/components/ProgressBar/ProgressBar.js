import { LinearProgress, Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { makeStyles, withStyles, lighten } from "@material-ui/core";


const BorderLinearProgress = withStyles({
  root: {
    height: 10,
		width: 600,
    backgroundColor: lighten('#ff6c5c', 0.5),
  },
  bar: {
    borderRadius: 20,
    backgroundColor: '#fffff',
  },
})(LinearProgress);

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  margin: {
    margin: theme.spacing(1),
  },
}));

const ProgressBar = ({playerPosition, lastPosition}) => {
    const [value, setValue] = useState(0);

    const normalise = (progress, end) => ((progress) * 100) / (end);

    useEffect(() => {        
        setValue(normalise(playerPosition, lastPosition));
    }, [playerPosition, lastPosition])
    const classes = useStyles(); 

    return (
        <>
          <Box sx={{ width: '100%', mr: 1 }}>
            <BorderLinearProgress className={classes.margin} variant="determinate" color="secondary" value={value} />
          </Box>
          <Box sx={{ minWidth: 35 }}>
            <Typography variant="body2" color="common.white">{`${Math.round(value,)}%`}</Typography>
          </Box>
        </>
      );
}

export default ProgressBar;