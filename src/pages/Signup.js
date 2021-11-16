import React, {useState} from "react";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import './Signup.css'
// import background from '../images/BackgroundTwo.png';


//async function signupUser(credentials) {
//    return fetch('http://localhost:8080/signup', {
//        method: 'POST',
//        headers: {
//            'Content-Type': 'application/json'
//        },
//        body: JSON.stringify(credentials)
//    })
//        .then(data => data.json())
//}

export default function Signup({ setToken }) {
    let inputPassword = '';
    let confirmPassword = '';
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();

    function checkPassword(inputPassword, confirmPassword){
        if(inputPassword === confirmPassword){
            this.setPassword(confirmPassword)
        }
    }

    const handleSubmit = async e => {
        e.preventDefault();
        const token = await Signup({
            username,
            password,
//            confirm password

        });
        setToken(token);
    }

    return(
    <React.Fragment>

        <div className="signup-wrapper">
            {/* <img class="imgcontainer" src={background} /> */}
            <h1>Please Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Username</p>
                    <input type="text" onChange={e => setUserName(e.target.value)} />
                </label>
                <label>
                    <p>Password</p>
                    <input type="password" 
                     //onChange={e => this.inputPassword = e.target.value}
                    />
                </label>
                <label>
                    <p>Confirm Password</p>
                    <input type="text" onChange={e => confirmPassword(this.password, e.target.value)} />
                </label>
                <div>
                    <Button variant="contained">Sign Up</Button>
                </div>
            </form>
        </div>
    </React.Fragment>
    )
}

Signup.propTypes = {
    setToken: PropTypes.func.isRequired
};

//function Signup() {
//  return (
//    <div>
//      <h1>Sign Up Page</h1>
//    </div>
//  );
//}
//
//export default Signup;