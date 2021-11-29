import React from "react";
import "./Key.css";


const BottomFunctionKey = ({ children }) => {

    return (
        <React.Fragment>
            <div className="key key__bottom-funct key__bs">
                {children}
            </div>
        </React.Fragment>
    );
  };

  export default BottomFunctionKey;