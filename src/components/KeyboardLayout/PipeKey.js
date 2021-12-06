import React, { useEffect, useState } from "react";
import "./Key.css";
import { Tooltip } from "@mui/material";

const PipeKey = ({top, bottom, user}) => {
    const [topInfo, setTopInfo] = useState('');
    const [bottomInfo, setBottomInfo] = useState('');

    useEffect(() => {
        if (user && user.allKeys[top]) {
            setTopInfo(top + ': ' + user.allKeys[top] + '%');           
        } else if (user && !user.allKeys[top]) {
            setTopInfo(top + ": You haven't typed this key yet!");
        }

        if (user && user.allKeys[bottom]) {
            setBottomInfo(bottom + ': ' + user.allKeys[bottom] + '%');
        } else if (user && !user.allKeys[bottom]) {
            setBottomInfo(bottom + ": You haven't typed this key yet!");
        }
      }, [user, top, bottom])

    return (
        <React.Fragment>
            <Tooltip title={<span><p>{topInfo}</p><p>{bottomInfo}</p></span>} arrow>
                <div className="key key__oneandhalf">
                    {'|'} <span/> {'\\'}
                </div>
            </Tooltip>
        </React.Fragment>
    );
  };

export default PipeKey;