import React from "react";
import Contact from "./Contact";
import style from "./Employees.css";

const employees = () => (
  <div className={style.Employees}>
    <div className={style.Block}>
      <Contact
        name="Ing. Šídová Iva"
        phone="485 355 200"
        fax="485 355 202"
        mail="iva.sidova@tul.cz"
      />
      <Contact
        name="Ing. Dvořáková Veronika"
        work="vedoucí ubytovací
    služby"
        phone="485 355 250"
        mail="veronika.dvorakova@tul.cz"
      />{" "}
    </div>
    <div className={style.Block}>
      <Contact
        name="Ing. Karas Vladimír"
        work="správce kolejí"
        phone="485 355 251"
        fax="485 355 202"
        mail="vladimir.karas@tul.cz"
      />
      <Contact
        name="Ing. Pugnerová Anna"
        work="vedoucí stravovacích provozů TUL"
        phone="485 355 290"
        fax="485 355 202"
        mail="anna.pugnerova@tul.cz"
      />{" "}
    </div>
    <div className={style.Block}>
      <Contact
        name="Vavřinová Petra"
        work="sekretářka ředitele"
        phone="485 355 201"
        fax="485 355 202"
        mail="petra.vavrinova@tul.cz"
      />
      <Contact
        name="Špačková Michala"
        work="provozní ekonom"
        phone="485 355 255"
        mail="michala.spackova@tul.cz"
      />
    </div>
    <div>
      <Contact
        name="Ubytovací služba"
        phone="485 355 252"
        mail="us.koleje@tul.cz"
      />
    </div>
  </div>
);
export default employees;
