import React from "react";
import "./Toolbar.scss";
import { NavLink, withRouter } from "react-router-dom";

const PublicToolbar = () => {
    return (
        <ul className="toolbar_items">
            <li className="toolbar_items_item">
                <NavLink to="/animals" className="toolbar_items_item_link">
                    <p className="toolbar_items_item_text">Prochazet</p>
                </NavLink>
            </li>
            <li className="toolbar_items_item">
                <NavLink to="/registration" className="toolbar_items_item_link">
                    <p className="toolbar_items_item_text">Registrace</p>
                </NavLink>
            </li>
            <li className="toolbar_items_item">
                <NavLink to="/login" className="toolbar_items_item_link">
                    <p className="toolbar_items_item_text">Prihlasit se</p>
                </NavLink>
            </li>
        </ul>
    );
};

export default withRouter(PublicToolbar);
