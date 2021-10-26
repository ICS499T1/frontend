import React from "react";

import "./Menu.css";

const MenuBar = () => {
  return (
    <nav className="header">
      <div className="nav-wrapper">
        <a className="logo" href="/">
          StartTyper
        </a>
        <input className="menu-btn" type="checkbox" id="menu-btn" />
        <label className="menu-icon" htmlFor="menu-btn">
          <span className="navicon"></span>
        </label>

        <ul className="menu">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/Sign up">Sign up</a>
          </li>
          <li>
            <a href="/AboutUs">Log in</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default MenuBar;
