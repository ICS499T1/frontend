import {Box, Paper} from '@mui/material';
import { useImageBackgroundStyle } from '../hooks/useImageBackgroundStyle';

const ImageBackground = ({image}) => {
    const classes = useImageBackgroundStyle(image);
    return (
        <Box>
            <Paper className={classes.paperContainer}>
            </Paper>
        </Box>
    );
}

export default ImageBackground;