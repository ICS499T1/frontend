import React from 'react'
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom"

import './Footer.css'

const Footer = () => {
    return (
        <footer >
            <div className="footer">
                <div className="aboutUs">
                    <ul>
                        <Grid item xs={12} sm={12} md={6} lg={6}>
                            <h3>&copy; Typing Game - 2021.</h3>
                            <p>Metropolitan State University,</p>
                            <p>Saint Paul</p>
                            <hr></hr>
                            <h5>If you have any questions, please reach out to us at @support@metrostate.edu</h5>
                        </Grid>
                        </ul>
                </div>

            <div className="contactUs">

                    <h3>
                        Contact Us
                    </h3>
                    <p>support@metrostate.edu</p>
                    <p>Phone +1 (xxx) xxx-xxxx </p>
                    <p>Fax +1 (xxx) xxx-xxxx </p>
                {/*</Grid>*/}
            </div>

                <div className="links">


                            <ul>
                                <li><a href="/policy">Privacy Policy</a></li>
                                <li><a href="/terms">Terms of Service</a></li>
                                <li><a href="/tutorials">Tutorials</a></li>
                                <li><a href="/home">Create Account</a></li>
                                <li><a href="/aboutus">About Us</a></li>
                            </ul>


                </div>

                {/*<ul className="social">*/}
                {/*    <li>*/}
                {/*        <a href="https://www.facebook.com"><i className="fa fa-facebook"></i></a>*/}
                {/*    </li>*/}
                {/*    <li>*/}
                {/*        <a href="https://www.twitter.com"><i className="fa fa-twitter"></i></a>*/}
                {/*    </li>*/}
                {/*    <li>*/}
                {/*        <a href="https://www.instagram.com"><i className="fa fa-instagram"></i></a>*/}
                {/*    </li>*/}
                {/*    <li>*/}
                {/*        <a href="https://www.youtube.com"><i className="fa fa-youtube"></i></a>*/}
                {/*    </li>*/}
                {/*    <li>*/}
                {/*        <a href="https://www.linkedin.com"><i className="fa fa-linkedin"></i></a>*/}
                {/*    </li>*/}
                {/*</ul>*/}


            </div>
        </footer>
    )
}

export default Footer;