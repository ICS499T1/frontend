import React from "react";
import Paper from '@mui/material/Paper'

const styles = (imgPath) => {
    const styles = {
        paperContainer: {
          height: 1100,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: `url(${imgPath})`,
          backgroundColor: '#2E2F43'
        },
    };
    return (styles);
}

const Background = ({children, imgPath}) => {
    let style = styles(imgPath);
    return (
        <Paper style={style.paperContainer}>{children}</Paper>
    );

}

export default Background;