import React, {Component} from "react";
import "./Animals.scss";
import Animals from "./Animals";

class MyAnimals extends Component {
    render() {
        return (
            <Animals myAnimals={true} />
        )
    }
}

export default MyAnimals;
