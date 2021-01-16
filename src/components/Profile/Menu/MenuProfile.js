import React, { Component } from "react";
import "../../Animals/Menu/Menu.scss";
import { NavLink } from "react-router-dom";

class Menu extends Component {
  render() {
    return (
      <div className="menu">
        <div className="menu_block">
          <NavLink to="/profile/zakladni" className="menu_block_link">
            Informace
          </NavLink>
        </div>
        <div className="menu_block">
          <NavLink to="/profile/2" className="menu_block_link">
            menu2
          </NavLink>
        </div>
      </div>
    );
  }
}

export default Menu;
