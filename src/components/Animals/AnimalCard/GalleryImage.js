import React from "react";
import "./GalleryImage.scss";

const GalleryImage = (props) => {
    return (
        <div className={"galleryImage " + props.selected} onClick={props.onClick}>
            <img src={props.src} alt="" />
        </div>
    );
}


export default GalleryImage;
