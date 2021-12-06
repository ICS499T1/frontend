import React from "react";
import "./Key.css";
import KeyboardCapslockIcon from '@mui/icons-material/KeyboardCapslock';

const CapsLock = () => {

    return (
        <React.Fragment>
            <div className="key key__caps key__mui">
                <KeyboardCapslockIcon/>
            </div>
        </React.Fragment>
    );
  };

  export default CapsLock;