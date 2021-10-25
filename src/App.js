import './App.css';
import React, { Component } from 'react';
import Body from "./components/Body";
import Users from './components/users';
import background from './images/Background.png'; 
import secondaryImage from './images/Type.png'; 
import Button from '@material-ui/core/Button';
import MenuBar from "./components/Menu";

class App extends Component {
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

    render() {
        return (
            <React.Fragment>
                <MenuBar />
                <Body />
            </ React.Fragment>
            // {/*// <div className="body-wrap">*/}
            // {/*//     <div class="container">*/}
            // {/*//*/}
            // {/*//         /!*<Button class="LoginButton">*!/*/}
            // {/*//         /!*    Log in*!/*/}
            // {/*//         /!*</Button>*!/*/}
            // {/*//         /!*<Button class="SignupButton">*!/*/}
            // {/*//         /!*    Sign Up*!/*/}
            // {/*//         /!*</Button>*!/*/}
            // {/*//         /!*<Button class="SoloplayButton">*!/*/}
            // {/*//         /!*    Solo Play*!/*/}
            // {/*//         /!*</Button>*!/*/}
            // {/*//         /!*<Button class="GroupplayButton">*!/*/}
            // {/*//         /!*    Group Play*!/*/}
            // {/*//         /!*</Button>*!/*/}
            // {/*//         /!*<img src={background}/>*!/*/}
            // {/*//     </div>*/}
            // {/*//     <div>*/}
            // {/*//         <img src={secondaryImage} style={{height:'auto',width:'35%'}}/>*/}
            // {/*//         <h5>WHAT IS TYPINGGAME?</h5>*/}
            // {/*//         <h2>TypingGame is the most effective way to improve typing skills.</h2>*/}
            // {/*//     </div>*/}
            // {/*// </div>*/}
            // {/*    */}
            //
            // {/*// <Users users={this.state.users} />*/}
        )
    }
}

export default App;
