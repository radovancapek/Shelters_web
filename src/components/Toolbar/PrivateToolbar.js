import React from "react";
import "./Toolbar.scss";
import {NavLink} from "react-router-dom";
import { withRouter } from "react-router";

const PrivateToolbar = (props) => {
    return (
        <ul className="toolbar_items">
            <li className="toolbar_items_item">
                <NavLink to="/choice" className="toolbar_items_item_link">
                    <p className="toolbar_items_item_text">Vybirat</p>
                </NavLink>
            </li>
            <li className="toolbar_items_item">
                <NavLink to="/animals" className="toolbar_items_item_link">
                    <p className="toolbar_items_item_text">Prochazet</p>
                </NavLink>
            </li>
            <li className="toolbar_items_item">
                <NavLink to="/messages" className="toolbar_items_item_link">
                    <p className="toolbar_items_item_text">Zpravy</p>
                </NavLink>
            </li>
            <li className="toolbar_items_item">
                <NavLink to="/add" className="toolbar_items_item_link">
                    <p className="toolbar_items_item_text">Pridat zvire</p>
                </NavLink>
            </li>
            <li className="toolbar_items_item">
                <NavLink to="/profile" className="toolbar_items_item_link">
                    <p className="toolbar_items_item_text">Profil</p>
                </NavLink>
            </li>
            <li className="toolbar_items_item">
                <p className="toolbar_items_item_text" onClick={props.logout}>Odhlasit</p>
            </li>
        </ul>
    );
};

export default withRouter(PrivateToolbar);
