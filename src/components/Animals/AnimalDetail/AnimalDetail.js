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

    componentDidMount() {
        document.addEventListener("keydown", this.escFunction, false);
    }

    escFunction = (event) => {
        if (event.keyCode === 27) {
            this.props.close();
        }
    }

    render() {
        return (
            <div className="animalDetail">
                <AnimalCard
                    largeCard="true"
                    gallery="true"
                    onClickOutside={this.props.close}
                    close={this.props.close}
                    animal={this.props.animal}
                    animalId={this.props.animalId}
                />
            </div>
        )
    }

}

export default AnimalDetail;
