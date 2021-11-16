import React from "react";

import Footer from "./Footer"
import Menu from "./Navbar/Navbar";
import './Layout.css'

const Layout = ({ children }) => {
        return (
            <React.Fragment>
                <Menu />
                {children}
                <Footer />
            </React.Fragment>
        );
}

export default Layout; 