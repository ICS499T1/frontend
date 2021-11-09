import React from "react";

import Footer from "./Footer"
import Menu from "./Menu";
import './Layout.css'

const Layout = (props) => {
        return (
            <React.Fragment>
                <Menu />

                <main className="main-content">
                    {props.children}
                </main>

                <Footer />
            </React.Fragment>
        );
}

export default Layout;