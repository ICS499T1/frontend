import React from "react";

import Footer from "./Footer"
import Menu from "./Navbar/Navbar";
import './Layout.css'

const Layout = ({ children }) => {
        return (
            <React.Fragment>
                <Menu />

                <main className="main-content">
                    {children}
                </main>

                <Footer />
            </React.Fragment>
        );
}

export default Layout; 