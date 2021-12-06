import React from "react";
import "./Key.css";
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';

const ReturnKey = () => {

    return (
        <React.Fragment>
            <div className="key key__enter key__mui">
                <KeyboardReturnIcon/>
            </div>
        </React.Fragment>
    );
  };

  export default ReturnKey;