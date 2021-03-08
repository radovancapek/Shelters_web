import React, {Component} from "react";
import "./AnimalDetail.scss";
import AnimalCard from "../AnimalCard/AnimalCard";

class AnimalDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageUrlList: []
        }
    }

    contact = () => {

    }

    render() {
        return (
            <div className="animalDetail">
                <AnimalCard largeCard="true" gallery="true" onClickOutside={this.props.close} close={this.props.close} animal={this.props.animal}/>
            </div>
        )
    }

}

export default AnimalDetail;
