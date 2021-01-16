import React from "react";
import Map from "./Map/Map";
import Card from "./Card/Card";
import style from "./BasicContacts.css";

const basicContacts = () => (
  <div className={style.BasicContacts}>
    <Card className={style.BasicContacts_card}></Card>
    <Map className={style.BasicContacts_map} />
  </div>
);

export default basicContacts;
