import React, { Component } from "react";
import style from "./Contacts.css";
import Menu from "./Menu/MenuContacts";

class Contacts extends Component {
  render() {
    return (
      <div className={style.page}>
        <Menu className={style.menu} />
        <div className={style.wrapper}>{this.props.children}</div>
      </div>
    );
  }
}

export default Contacts;
