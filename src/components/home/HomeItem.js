import React from "react";
import "./HomeItem.scss";
import { NavLink } from "react-router-dom";

const homeItem = (props) => (
  <div className={props.className}>
    <NavLink to={{ pathname: "/animals", animalType: props.animalType }} className="Home_item_link">
      <p className="Home_item_link_text">{props.text}</p>
    </NavLink>
  </div>
);

export default homeItem;
