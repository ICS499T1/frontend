import React from "react";
import "./Key.css";

const BottomFunctionKey = ({ keyType }) => {

    return (
        <React.Fragment>
            <div className="key key__bottom-funct">
                {keyType}
            </div>
        </React.Fragment>
    );
  };

  export default BottomFunctionKey;