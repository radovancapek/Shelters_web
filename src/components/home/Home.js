import React, { Component } from "react";
import "./Home.scss";
import HomeItem from "./HomeItem";
import {withTranslation} from "react-i18next";

class Home extends Component {
  render() {
    const {t} = this.props;
    return (
      <div className="wrapper">
        <div className="Home">
          <HomeItem
            link="/other"
            text={t('animals.other.other')}
            className="Home_item Home_item--1"
            animalType="other"
          />
          <HomeItem
            link="/cats"
            text={t('animals.cats.cats')}
            className="Home_item Home_item--2"
            animalType="cats"
          />
          <HomeItem
            link="/dogs"
            text={t('animals.dogs.dogs')}
            className="Home_item Home_item--3"
            animalType="dogs"
          />
        </div>
      </div>
    );
  }
}

export default withTranslation()(Home)
