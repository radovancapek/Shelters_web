import React from "react";
import style from "./ProfileInfo.css";
import Avatar from "@material-ui/core/Avatar";

const profileInfo = (props) => (
  <div className={style.profileInfo}>
    <Avatar
      alt={props.user.name}
      src={props.user.image}
      className={style.large}
    ></Avatar>
    <div className={style.profileInfo_info}>
      <h3>{props.user.name}</h3>
      <p>{props.user.street}</p>
      <p>{props.user.city}</p>
    </div>
  </div>
);

export default profileInfo;
