
import React from "react";
import Background from "../components/Background";
import NotFoundImage from "../images/notfound.png";

const NotFound = () => {

    return (
        <React.Fragment>
            <Background imgPath={NotFoundImage}>             
            </Background>
        </React.Fragment>
    );
  };

  export default NotFound;