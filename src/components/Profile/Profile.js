import React, { Component } from "react";
import style from "./Profile.css";
import Menu from "./Menu/MenuProfile";

class Profile extends Component {
  render() {
    return (
      <div className={style.page}>
        <Menu className={style.menu} />
        <div className={style.wrapper}>{this.props.children}</div>
      </div>
    );
  }
}

export default Profile;
