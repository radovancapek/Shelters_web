import React from "react";
import "./Layout.scss";
import Toolbar from "../Toolbar/Toolbar";
import Footer from "../Footer/Footer";

const layout = (props) => (
  <div className="layout">
      <Toolbar home={false} logged={false} shelterLogged={false} />
      <main className="Main">{props.children}</main>
      <Footer />
  </div>
);

export default layout;
