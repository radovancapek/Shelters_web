import React, { Component } from "react";
import "./Home.scss";
import HomeItem from "./HomeItem";
import Toolbar from "../Toolbar/Toolbar";

class Home extends Component {
  render() {
    return (
      <div className="wrapper">
          <Toolbar home={true} logged={true} shelterLogged={true}/>

          <div className="Home">
            <HomeItem
              link="/dogs"
              text="Ostatní"
              className="Home_item Home_item--1"
            />
            <HomeItem
              link="/cats"
              text="Kočky"
              className="Home_item Home_item--2"
            />
            <HomeItem
              link="/choose"
              text="Psi"
              className="Home_item Home_item--3"
            />
        </div>
      </div>
    );
  }
}

export default Home;
