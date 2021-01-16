import React, { Component } from "react";
import style from "./Dogs.css";
import Menu from "../Contacts/Menu/MenuContacts";
class Dogs extends Component {
    render() {
        return (
            <div className={style.page}>
                <div className={style.wrapper}>{this.props.children}</div>
            </div>
        );
    }
}

export default Dogs;
