import React from "react";
import "./Layout.scss";

const layout = (props) => (
  <div className="layout">
    <main className="Main">{props.children}</main>
  </div>
);

export default layout;
