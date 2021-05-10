import React, {Component} from "react";
import "./Animals.scss";
import Animals from "./Animals";

class LikedAnimals extends Component {
    render() {
        return (
            <Animals likedAnimals={true} />
        )
    }
}

export default LikedAnimals;
