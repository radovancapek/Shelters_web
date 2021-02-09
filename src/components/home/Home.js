import React, { Component } from "react";
import "./Home.scss";
import HomeItem from "./HomeItem";

class Home extends Component {
  render() {
    return (
      <div className="wrapper">
        <div className="Home">
          <HomeItem
            link="/other"
            text="Ostatní"
            className="Home_item Home_item--1"
            animalType="other"
          />
          <HomeItem
            link="/cats"
            text="Kočky"
            className="Home_item Home_item--2"
            animalType="cats"
          />
          <HomeItem
            link="/dogs"
            text="Psi"
            className="Home_item Home_item--3"
            animalType="dogs"
          />
        </div>
      </div>
    );
  }
}

export default Home;
