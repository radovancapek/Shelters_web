import React from "react";
import style from "./Contact.css";

const contact = (props) => (
  <div className={style.Contact}>
    <h3>{props.name}</h3>
    {props.work && <p>Pozice: {props.work}</p>}
    {props.phone && <p>Telefon: {props.phone}</p>}
    {props.phone2 && <p>Telefon: {props.phone2}</p>}
    {props.fax && <p>Fax: {props.fax}</p>}
    {props.mail && <p>E-mail: {props.mail}</p>}
  </div>
);
export default contact;
