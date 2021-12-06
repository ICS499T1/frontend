import React from "react";
import "./Key.css";
import BackspaceIcon from '@mui/icons-material/Backspace';

const Backspace = () => {

    return (
        <React.Fragment>
            <div className="key key__delete key__mui">
                <BackspaceIcon/>
            </div>
        </React.Fragment>
    );
  };

  export default Backspace;