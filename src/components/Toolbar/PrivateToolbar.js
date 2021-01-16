import React from "react";
import "./Toolbar.scss";
import { NavLink } from "react-router-dom";

const PrivateToolbar = () => {
    return (
        <ul className="toolbar_items">
            <li className="toolbar_items_item">
                <NavLink to="/animals" className="toolbar_items_item_link">
                    <p className="toolbar_items_item_text">Vybirat</p>
                </NavLink>
            </li>
            <li className="toolbar_items_item">
                <NavLink to="/animals" className="toolbar_items_item_link">
                    <p className="toolbar_items_item_text">Prochazet</p>
                </NavLink>
            </li>
            <li className="toolbar_items_item">
                <NavLink to="/profile" className="toolbar_items_item_link">
                    <p className="toolbar_items_item_text">Zpravy</p>
                </NavLink>
            </li>
            <li className="toolbar_items_item">
                <NavLink to="/profile" className="toolbar_items_item_link">
                    <p className="toolbar_items_item_text">Profil</p>
                </NavLink>
            </li>
        </ul>
    );
};

export default PrivateToolbar;
