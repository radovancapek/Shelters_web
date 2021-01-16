import React from "react";
import "./InnerLayout.scss";
import Toolbar from "../Toolbar/Toolbar";

const innerLayout = (props) => (
  <div className="innerLayout">
    <Toolbar home={false} logged={false} shelterLogged={true} />
    <main className="innerMain">{props.children}</main>
  </div>
);

export default innerLayout;
