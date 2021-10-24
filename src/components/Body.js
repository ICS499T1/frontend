import React from 'react'
import { Link } from "react-router-dom"
import './Body.css'
import Button from "@material-ui/core/Button";

const Body = () => {
    return (
        <React.Fragment>
            <header className="bg-image">
                <div className="bg-container">
                    <button className="soloplay">Solo Play</button>
                    <button className="multiplay">Multi Play</button>
                </div>
            </header>
            <div className="typingImage">
                <h5>WHAT IS TYPING GAME?</h5>
                <p>TypingGame is the most effective way to improve typing skills.</p>
                {/*<button>Get Started Now</button>*/}
                </div>
        </React.Fragment>
    )
}

export default Body;