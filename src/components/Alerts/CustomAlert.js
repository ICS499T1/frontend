import React from "react";
import { useState, useEffect } from 'react';
import { Collapse, Alert, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

const CustomTextAlert = ({inputText, severityType}) => {
  const [text, setText] = useState('');

  useEffect(() => {
    setText(inputText);
  }, [inputText]);

    return(
      <Collapse in={text !== ''}>
          <Alert
            severity={severityType}
            action={
            <IconButton
              color="inherit"
              size="small"
              onClick={() => {
                setText('');
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
                }
          sx={{ mb: 2 }}>
            {text}
          </Alert>
        </Collapse>
    );
}

const CustomBoolAlert = ({input, severityType, text}) => {
  const [bool, setBool] = useState(false);

  useEffect(() => {
      setBool(input);
  }, [input]);

    return(
      <Collapse in={bool}>
          <Alert
          severity="error"
          sx={{ mb: 2 }}>
          {text}
          </Alert>
    </Collapse>
    );
}

export  { CustomTextAlert, CustomBoolAlert };