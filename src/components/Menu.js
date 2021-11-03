import React from "react";
import "./Menu.css";
import {Link} from 'react-router-dom';

const MenuBar = () => {
  return (
    <nav className="header">
        <ul>
          <Link to="/">
            <li className="logo"><b>SpaceRacer</b></li>
          </Link>
          <Link to="/">
            <li className="links">Home</li>
          </Link>
          <Link to="/signin">
            <li className="links">Sign In</li>
          </Link>
          <Link to="/signup">
            <li className="links">Sign Up</li>
          </Link>
          <Link to="/leaderboard">
            <li className="links">Leaderboard</li>
          </Link>
        </ul>
    </nav>

  );
};


// <nav className="header">
//       <div className="nav-wrapper">
//         <a className="logo" href="/">
//           StartTyper
//         </a>
//         <input className="menu-btn" type="checkbox" id="menu-btn" />
//         <label className="menu-icon" htmlFor="menu-btn">
//           <span className="navicon"></span>
//         </label>

//         <ul className="menu">
//           <li>
//             <a href="/">Home</a>
//           </li>
//           <li>
//             <a href="/sign up">Sign up</a>
//           </li>
//           <li>
//             <a href="/login">Log in</a>
//           </li>
//         </ul>
//       </div>
//     </nav>
export default MenuBar;