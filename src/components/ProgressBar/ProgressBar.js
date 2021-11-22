import { LinearProgress, Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";

const ProgressBar = ({playerPosition, lastPosition}) => {
    const [value, setValue] = useState(0);

    const normalise = (progress, end) => ((progress) * 100) / (end);

    useEffect(() => {        
        setValue(normalise(playerPosition, lastPosition));
    }, [playerPosition, lastPosition])
    

    return (
        <>
          <Box sx={{ width: '100%', mr: 1 }}>
            <LinearProgress variant="determinate" value={value} />
          </Box>
          <Box sx={{ minWidth: 35 }}>
            <Typography variant="body2" color="common.white">{`${Math.round(value,)}%`}</Typography>
          </Box>
        </>
      );
}

export default ProgressBar;