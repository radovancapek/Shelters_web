import React, { Component } from "react";
import "../../Animals/Menu/Menu.scss";
import { NavLink } from "react-router-dom";

class Menu extends Component {
  render() {
    return (
      <div className="menu">
        <div className="menu_block">
          <NavLink to="/kontakty/zakladni" className="menu_block_link">
            Základní
          </NavLink>
        </div>
        <div className="menu_block">
          <NavLink to="/kontakty/zamestnanci" className="menu_block_link">
            Zaměstnanci kolejí
          </NavLink>
        </div>
        <div className="menu_block">
          <NavLink to="/kontakty/pokoje" className="menu_block_link">
            Pokoje
          </NavLink>
        </div>
      </div>
    );
  }
}

export default Menu;
