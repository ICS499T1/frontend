import React, { useEffect, useState } from "react";
import "./Key.css";
import { Tooltip } from "@mui/material";
import SpaceBarIcon from '@mui/icons-material/SpaceBar';

const Spacebar = ({user}) => {
    const [spaceAccuracy, setSpaceAccuracy] = useState('');

    useEffect(() => {
        if (user && user.allKeys[' ']) {
            setSpaceAccuracy('Space: ' + user.allKeys[' '] + '%');           
        } else if (user && !user.allKeys[' ']) {
            setSpaceAccuracy("Space: You haven't typed this key yet!");
        }
      }, [user])

    return (
        <React.Fragment>
            <Tooltip title={spaceAccuracy} arrow>
                <div className="key key__spacebar key__mui">
                    <SpaceBarIcon/>
                </div>
            </Tooltip>
        </React.Fragment>
    );
  };

  export default Spacebar;