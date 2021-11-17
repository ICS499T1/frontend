import React from 'react';
import Button from "@mui/material/Button";


export default function CustomButton({name, top, right, bottom, left}) {
    return (
        <Button sx={{ position: 'relative', top: `${top}`, right: `${right}`, left: `${left}`, bottom: `${bottom}` }} variant="contained">{name}</Button>
    );
}