import React, {Component} from "react";
import "./AnimalCard.scss";
import {storage} from "../../Firebase/Firebase"

class AnimalCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            imageUrl: "",
        };
    }

    setImageUrl = (url) => {
        this.setState({imageUrl: url});
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
                <p className="animal_card_name">{this.props.animal.name}</p>
                <img className="animal_card_image" alt={this.props.animal.name} src={this.state.imageUrl}/>
                <div className="animal_card_info">
                    <p className="animal_card_info_age">věk: {this.props.animal.age}</p>
                    <p className="animal_card_info_dist">vzdálenost: 5 km</p>
                </div>
                {this.props.largeCard ? (<div className="animal_card_desc"><p>{this.props.animal.desc}</p></div>) : (null)}
            </div>
        )
    }

}

export default AnimalCard;
