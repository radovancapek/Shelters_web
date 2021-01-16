import React from "react";
import "./GalleryImage.scss";

const GalleryImage = (src) => {
    return (
        <div className="galleryImage">
            <img src={src.src} alt="" />
        </div>
    );
}


export default GalleryImage;
