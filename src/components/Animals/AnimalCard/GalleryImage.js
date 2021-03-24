import React from "react";
import "./GalleryImage.scss";

const GalleryImage = (props) => {
    const hover = props.hover ? "hover" : "";
    return (
        <div className={"galleryImage " + hover} onClick={props.onClick}>
            <img src={props.src} alt="" />
        </div>
    );
}


export default GalleryImage;
