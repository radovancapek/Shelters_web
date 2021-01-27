import React, { Component } from "react";
import "./Animals.scss";
import AnimalCard from "./AnimalCard/AnimalCard";
import { db } from "../Firebase/Firebase"

class Animals extends Component {

    constructor(props) {
        super(props);
        this.state = {
            animals: [],
            mounted: false
        }
    }

    componentDidMount() {
        this.loadData();
        this.setState({ mounted: true });
    }


    onCollectionUpdate = (querySnapshot) => {
        const dogs = [];
        querySnapshot.forEach((doc) => {
            dogs.push(doc.data())
        });
        this.setState({ animals: dogs });
    }

    loadData() {
        db.collection("dogs")
            .onSnapshot(this.onCollectionUpdate);
    }

    render() {
        const mounted = this.state.mounted;
        let animalCards;
        animalCards = this.state.animals.map((animal, i) => {
            return (
                <AnimalCard animal={animal} key={i} className="card" />
            );
        });

        return (
            <div className="page">
                {mounted ? (<div className="wrapper">{animalCards}</div>) : (
                    <div>loading</div>
                )}
            </div>

        )
    }
}

export default Animals;
