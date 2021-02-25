import React, { Component } from "react";
import "./AnimalCard.scss";
import { storage } from "../../Firebase/Firebase"
import {faImage} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

//TODO vzdalenost podle polohy nas a zvirete
class AnimalCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            imageUrl: null,
        };
    }

    setImageUrl = (url) => {
        this.setState({ imageUrl: url });
    }

    render() {
        const ref = storage.ref(this.props.animal.image);

        ref.getDownloadURL()
            .then(this.setImageUrl)
            .catch(function (error) {
                console.log("Error " + error.message);
            });

        return (
            <div className="animal_card">
                <div className="animal_card_name">{this.props.animal.name}</div>
                {this.state.imageUrl ?
                    <img className="animal_card_image" alt={this.props.animal.name} src={this.state.imageUrl} />
                    :
                    <FontAwesomeIcon className="imageIcon" icon={faImage}/>
                }


                <div className="animal_card_info">
                    <p className="animal_card_info_age">věk: {this.props.animal.age}</p>
                    <p className="animal_card_info_dist">vzdálenost: TODO km</p>
                </div>
                {this.props.largeCard ? (<div className="animal_card_desc"><p>{this.props.animal.desc}</p></div>) : (null)}
            </div>
        )
    }

}

export default AnimalCard;
