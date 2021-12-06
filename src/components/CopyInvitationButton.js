import React from 'react';
import {Button, Tooltip } from "@mui/material";
import GLOBAL from '../resources/Global';

const InvitationButton = ({gameId, gameStatus}) => {
    // Used for copy invitation button
    const [open, setOpen] = React.useState(false);
    // Used for copy invitation button tooltip
    const [copyFeedback, setCopyFeedback] = React.useState("");

    const handleCloseInvitation = () => {
        setOpen(false);
      };
    
    const copyToClipBoard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        setCopyFeedback("Copied Successfully");
        setOpen(true);
    } catch (err) {
        console.log("INSIDE ", { open }, err);
        setCopyFeedback("Failed to copy. Please check browser persmissions");
        setOpen(true);
    }
    };

    return (
        <Tooltip
        open={open}
        onClose={handleCloseInvitation}
        title={copyFeedback}
        leaveDelay={400}
        >
          <Button variant="contained" size="large" onClick={() => copyToClipBoard(GLOBAL.DOMAIN + '/multiplayer/' + gameId)}>
            Click to copy invitation!
          </Button>
        </Tooltip>
    );
}

export default InvitationButton;