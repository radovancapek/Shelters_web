import React, { Component } from "react";
import "./Menu.scss";
import { NavLink } from "react-router-dom";

class Menu extends Component {
  render() {
    return (
      <div className="menu">
        <div className="menu_block">
          <NavLink to="/prohlidka/A" className="menu_block_link">
            Blok A
          </NavLink>
        </div>
        <div className="menu_block">
          <NavLink to="/prohlidka/B" className="menu_block_link">
            Blok B
          </NavLink>
        </div>

        <div className="menu_block">
          <NavLink to="/prohlidka/C" className="menu_block_link">
            Blok C
          </NavLink>
        </div>
      </div>
    );
  }
}

export default Menu;
