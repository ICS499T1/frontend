import React, { useEffect, useState } from "react";
import "./Key.css";
import { Tooltip } from "@mui/material";

const Key = ({big, small, user}) => {
    const [bigInfo, setBigInfo] = useState('');
    const [smallInfo, setSmallInfo] = useState('');

    useEffect(() => {
        if (user && user.allKeys[big]) {
            setBigInfo(big + ': ' + user.allKeys[big] + '%');           
        } else if (user && !user.allKeys[big]) {
            setBigInfo(big + ": You haven't typed this key yet!");
        }

        if (user && user.allKeys[small]) {
            setSmallInfo(small + ': ' + user.allKeys[small] + '%');
        } else if (user && !user.allKeys[small]) {
            setSmallInfo(small + ": You haven't typed this key yet!");
        }
      }, [user, big, small])

    return (
        <React.Fragment>
            <Tooltip title={<span><p>{bigInfo}</p><p>{smallInfo}</p></span>} arrow>
                <div className="key">
                    {big}
                </div>
            </Tooltip>
        </React.Fragment>
    );
  };

  export default Key;