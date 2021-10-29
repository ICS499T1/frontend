import React from "react";

import Footer from "./Footer"
import MenuBar from "./MenuBar";

const Layout = (props) => {
    // state = {
    //     users: []
    // }

    // componentDidMount() {
    //     fetch('http://localhost:8080/user/getusers')
    //     .then(res => res.json())
    //     .then((data) => {
    //     this.setState({ users: data })
    //     })
    //     .catch(console.log)
    // }
        return (
            <React.Fragment>
                <MenuBar />

                <main className="main-content">
                    {props.children}
                </main>

                <Footer />
            </React.Fragment>
        );
}

export default Layout;
