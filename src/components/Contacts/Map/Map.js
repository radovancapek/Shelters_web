import React from "react";
import style from "./Map.css";

const map = () => (
  <div className={style.Map}>
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1500.3485347041005!2d15.088005942110781!3d50.77046800835521!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47093416ce5bd3a1%3A0x860b20000c4b372!2sTUL%20Halls%20of%20Residence!5e0!3m2!1scs!2scz!4v1593419624930!5m2!1scs!2scz"
      width="600"
      height="450"
      frameBorder="0"
      allowFullScreen=""
      aria-hidden="false"
      tabIndex="0"
      title="koleje"
      className={style.Iframe}
    />
  </div>
);

export default map;
